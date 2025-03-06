import { MeshReflectorMaterial, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  BallCollider,
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  useBeforePhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

// KeyControls Type
type KeyControls = {
  accelerate: boolean;
  decelerate: boolean;
  left: boolean;
  right: boolean;
  hop: boolean;
};

// Vehicle Controls
export const vehicleControls = [
  { name: "accelerate", keys: ["KeyW"] },
  { name: "decelerate", keys: ["KeyS"] },
  { name: "left", keys: ["KeyA"] },
  { name: "right", keys: ["KeyD"] },
  { name: "hop", keys: ["Space"] },
];

// Vehicle Constants
const up = new THREE.Vector3(0, 1, 0);
const maxForwardSpeed = 8;
const maxReverseSpeed = -1;

// Wheels
const wheels = [
  // Front
  { position: new THREE.Vector3(-0.45, -0.15, -0.4) },
  { position: new THREE.Vector3(0.45, -0.15, -0.4) },
  // Rear
  { position: new THREE.Vector3(-0.45, -0.15, 0.4) },
  { position: new THREE.Vector3(0.45, -0.15, 0.4) },
];

// Helpers
const _bodyPosition = new THREE.Vector3();
const _bodyEuler = new THREE.Euler();
const _cameraPosition = new THREE.Vector3();
const _impulse = new THREE.Vector3();

// VEHICLE COMPONENT
export const Vehicle = (props: RigidBodyProps) => {
  const { rapier, world } = useRapier();

  const bodyRef = useRef<RapierRigidBody>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const wheelsRef = useRef<(THREE.Object3D | null)[]>([]);

  const wheelRotation = useRef(0);

  const steeringInput = useRef(0);

  const steeringAngle = useRef(0);
  const steeringAngleQuat = useRef(new THREE.Quaternion());

  const driftSteeringAngle = useRef(0);

  const driftingLeft = useRef(false);
  const driftingRight = useRef(false);
  const driftSteeringVisualAngle = useRef(0);

  const speed = useRef(0);
  const grounded = useRef(false);
  const holdingJump = useRef(false);
  const jumpTime = useRef(0);

  const [, getKeyboardControls] = useKeyboardControls();

  useBeforePhysicsStep(() => {
    const controls = getKeyboardControls() as KeyControls;
    const { accelerate, decelerate, left, right, hop } = controls;

    const impulse = _impulse.set(0, 0, -speed.current).multiplyScalar(5);

    // Grounded Checker
    const groundRayResult = world.castRay(
      new rapier.Ray(bodyRef.current.translation(), { x: 0, y: -1, z: 0 }),
      1,
      false,
      undefined,
      undefined,
      undefined,
      bodyRef.current,
    );
    grounded.current = groundRayResult !== null;

    // Steering angle
    steeringInput.current = Number(left) - Number(right);

    // Update vehicle angle
    steeringAngle.current += steeringInput.current * 0.01;

    // Drifting controls
    if (holdingJump.current && !hop) {
      holdingJump.current = false;
      driftingLeft.current = false;
      driftingRight.current = false;
    }

    if (
      holdingJump.current &&
      grounded.current &&
      1 < speed.current &&
      jumpTime.current + 100 < Date.now()
    ) {
      if (left) {
        driftingLeft.current = true;
      }

      if (right) {
        driftingRight.current = true;
      }

      if (
        (driftingLeft.current && driftingRight.current) ||
        (!left && !right)
      ) {
        driftingLeft.current = false;
        driftingRight.current = false;
      }
    } else {
      driftingLeft.current = false;
      driftingRight.current = false;
    }

    // Drift steering
    let driftSteeringTarget = 0;

    if (driftingLeft.current) {
      driftSteeringTarget = 1;
    } else if (driftingRight.current) {
      driftSteeringTarget = -1;
    }

    driftSteeringAngle.current = THREE.MathUtils.lerp(
      driftSteeringAngle.current,
      driftSteeringTarget,
      0.5,
    );

    steeringAngle.current += driftSteeringAngle.current * 0.01;

    steeringAngleQuat.current.setFromAxisAngle(up, steeringAngle.current);

    impulse.applyQuaternion(steeringAngleQuat.current);

    // Acceleration and deceleration
    let speedTarget = 0;

    if (accelerate) {
      speedTarget = maxForwardSpeed;
    } else if (decelerate) {
      speedTarget = maxReverseSpeed;
    }

    speed.current = THREE.MathUtils.lerp(speed.current, speedTarget, 0.03);

    // jump
    if (grounded.current && hop && !holdingJump.current) {
      impulse.y = 12;
      holdingJump.current = true;

      jumpTime.current = Date.now();
    }

    // Apply impulse
    if (impulse.length() > 0) {
      bodyRef.current.applyImpulse(impulse, true);
    }

    // Damping
    bodyRef.current.applyImpulse(
      {
        x: -bodyRef.current.linvel().x * 1.5,
        y: 0,
        z: -bodyRef.current.linvel().z * 1.5,
      },
      true,
    );
  });

  // Update Vehicle
  useFrame((state, delta) => {
    // Body position
    const bodyPosition = _bodyPosition.copy(bodyRef.current.translation());
    groupRef.current.position.copy(bodyPosition);
    groupRef.current.quaternion.copy(steeringAngleQuat.current);
    groupRef.current.updateMatrix();

    // Drift visual angle
    driftSteeringVisualAngle.current = THREE.MathUtils.lerp(
      driftSteeringVisualAngle.current,
      driftSteeringAngle.current,
      delta * 10,
    );

    // Body rotation
    const bodyEuler = _bodyEuler.setFromQuaternion(
      groupRef.current.quaternion,
      "YXZ",
    );
    bodyEuler.y = bodyEuler.y + driftSteeringVisualAngle.current * 0.4;
    groupRef.current.rotation.copy(bodyEuler);

    // Wheel rotation
    wheelRotation.current -= (speed.current / 50) * delta * 100;
    wheelsRef.current.forEach((wheel) => {
      if (!wheel) return;

      wheel.rotation.order = "YXZ";
      wheel.rotation.x = wheelRotation.current;
    });

    // Wheel steering
    const frontWheelsSteeringAngle = steeringInput.current * 0.5;
    wheelsRef.current[1]!.rotation.y = frontWheelsSteeringAngle;
    wheelsRef.current[0]!.rotation.y = frontWheelsSteeringAngle;

    // Camera
    if (!state.controls) {
      const cameraPosition = _cameraPosition
        .set(0, 3, 10)
        .applyQuaternion(steeringAngleQuat.current)
        .add(bodyPosition);
      state.camera.position.copy(cameraPosition);
      state.camera.lookAt(bodyPosition);
    }
  });

  return (
    <>
      {/* body */}
      <RigidBody
        {...props}
        ref={bodyRef}
        colliders={false}
        mass={3}
        ccd
        name="Player"
        type="dynamic"
      >
        <BallCollider args={[0.7]} mass={3} />
      </RigidBody>

      {/* vehicle */}
      <group ref={groupRef}>
        <group position-y={-0.35}>
          <mesh>
            <boxGeometry args={[0.8, 0.4, 1.2]} />
            <meshBasicMaterial color="#fff" />
          </mesh>

          {wheels.map((wheel, index) => (
            <group
              key={index}
              ref={(ref) => ((wheelsRef.current as any)[index] = ref)}
              position={wheel.position}
            >
              <group rotation-z={-Math.PI / 2}>
                <mesh>
                  <cylinderGeometry args={[0.15, 0.15, 0.25, 16]} />
                  <meshStandardMaterial color="#222" />
                </mesh>
                <mesh scale={1.01}>
                  <cylinderGeometry args={[0.15, 0.15, 0.25, 6]} />
                  <meshStandardMaterial color="#fff" wireframe />
                </mesh>
              </group>
            </group>
          ))}
        </group>
      </group>
    </>
  );
};

// ARCHIVES DOCUMENTATION FOR RACETRACK

/* const racetrackPoints: THREE.Vector3[] = [];

const boxLength = 20;
const trackWidth = 20;
const numConesInner = 15;
const numConesOuter = 60;
const innerTrackRadius = boxLength / 2 - trackWidth;
const outerTrackRadius = boxLength / 2 + trackWidth;

for (let i = 0; i < numConesInner; i++) {
  const angle = (i / numConesInner) * Math.PI * 2;
  racetrackPoints.push(
    new THREE.Vector3(
      Math.cos(angle) * innerTrackRadius,
      1,
      Math.sin(angle) * innerTrackRadius,
    ),
  );
}

for (let i = 0; i < numConesOuter; i++) {
  const angle = (i / numConesOuter) * Math.PI * 2;
  racetrackPoints.push(
    new THREE.Vector3(
      Math.cos(angle) * outerTrackRadius,
      1,
      Math.sin(angle) * outerTrackRadius,
    ),
  );
} */

/* const colors = ["orange", "hotpink", "cyan"]; */

/* const Floor = () => (
  <>
    <RigidBody type="fixed" position={[0, -1, 0]}>
      <CuboidCollider args={[100, 1, 100]} />
    </RigidBody>

    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[50, 64]} />
      <MeshReflectorMaterial
        mirror={0}
        blur={[300, 30]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={0.8}
        depthScale={0.5}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#111"
        metalness={0.2}
      />
    </mesh>
  </>
); */

// export function Sketch() {
//     const { orbitControls, physicsDebug } = useControls(SKETCH, {
//         orbitControls: false,
//         physicsDebug: false,
//     })

//     return (
//         <>
//             <Canvas>
//                 <Physics debug={physicsDebug}>
//                     <KeyboardControls map={controls}>
//                         <ArcadeVehicle position={[15, 2, 0]} />
//                     </KeyboardControls>

//                     <Floor />

//                     {racetrackPoints.map((point, index) => (
//                         <RigidBody key={index} position={point} type="dynamic" colliders={false}>
//                             <mesh>
//                                 <cylinderGeometry args={[1, 1, 2, 16]} />
//                                 <meshStandardMaterial color={colors[index % colors.length]} />
//                             </mesh>
//                             <CylinderCollider args={[1, 1]} />
//                         </RigidBody>
//                     ))}

//                     <ambientLight intensity={2} />
//                     <pointLight intensity={40} decay={1.5} position={[0, 5, 0]} />

//                     {orbitControls && <OrbitControls makeDefault />}
//                     <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
//                 </Physics>

//                 <color attach="background" args={['#0f0f0f']} />
//             </Canvas>

//             <Instructions>
//                 * wasd to drive
//                 <br />
//                 space to jump
//                 <br />
//                 hold space while turning to drift
//             </Instructions>
//         </>
//     )
// }
