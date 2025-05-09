import { Collider } from "@dimforge/rapier3d-compat";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import {
  forwardRef,
  RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { spawn, wheels } from "src/constants/vehicle";
import { VehicleProps } from "../types/VehicleProps";
import { useVehicleController } from "./use-vehicle-controller";
import { useRacingVehicleStore } from "../../../extension/eva/store/useRacingVehicleStore";
import { CharacterRef } from "../../character.type";
import { Euler, MathUtils, Object3D, Quaternion, Vector3 } from "three";
import { Mesh } from "three";

// Constants for camera positioning
const cameraOffset = new Vector3(7, 3, 0);
const cameraTargetOffset = new Vector3(0, 1.5, 0);

// Pre-allocated vectors and objects to avoid garbage collection
const _bodyPosition = new Vector3();
const _airControlAngVel = new Vector3();
const _cameraPosition = new Vector3();
const _cameraTarget = new Vector3();
const _tmpVector = new Vector3();
const _tmpQuat = new Quaternion();
const _tmpEuler = new Euler();

export const RacingVehicle = forwardRef<CharacterRef, VehicleProps>(
  (props, ref) => {
    const { world, rapier } = useRapier();
    const threeControls = useThree((s) => s.controls);
    const [, getKeyboardControls] = useKeyboardControls();

    const [loaded, setLoaded] = useState(false);

    // References
    const chasisMeshRef = useRef<Mesh>(null!);
    const chasisBodyRef = useRef<RapierRigidBody>(null!);
    const wheelsObjectsRef = useRef<(Object3D | null)[]>([]);

    // Initialize wheel objects array
    useEffect(() => {
      wheelsObjectsRef.current = Array(wheels.length).fill(null);
    }, []);

    const { vehicleController } = useVehicleController(
      chasisBodyRef,
      wheelsObjectsRef as RefObject<Object3D[]>,
      wheels,
    );

    const { accelerateForce, brakeForce, steerAngle } = useRacingVehicleStore();

    // Camera smoothing states
    const [smoothedCameraPosition] = useState(() => new Vector3(0, 100, -300));
    const [smoothedCameraTarget] = useState(() => new Vector3());

    // Ground detection
    const ground = useRef<Collider | null>(null);

    // Set loaded state after a delay
    useEffect(() => {
      const timer = setTimeout(() => setLoaded(true), 1000);
      return () => clearTimeout(timer);
    }, []);

    // Expose API for parent components
    useImperativeHandle(ref, () => ({
      getCameraTarget: () => {
        const pos = chasisBodyRef.current?.translation();
        return pos ? new Vector3(pos.x, pos.y, pos.z) : null;
      },
      isReady: () => loaded,
    }));

    // Main game loop
    useFrame((state, delta) => {
      // Skip if any critical components are missing
      if (
        !chasisMeshRef.current ||
        !vehicleController.current ||
        !!threeControls ||
        !props.defaultPlayer
      )
        return;

      const t = 1.0 - Math.pow(0.01, delta);

      // Get controls state
      const chassis = vehicleController.current.chassis();
      const controller = vehicleController.current;
      const controls = getKeyboardControls();

      try {
        // Ground check with ray casting
        const chassisPos = chassis.translation();
        const ray = new rapier.Ray(
          { x: chassisPos.x, y: chassisPos.y, z: chassisPos.z },
          { x: 0, y: -1, z: 0 },
        );
        
        const raycastResult = world.castRay(ray, 1, false);
        ground.current = raycastResult ? raycastResult.collider : null;

        // Check if vehicle is flipped
        if (chassisPos.y < 0.25) {
          const bodyQuat = chassis.rotation();
          _tmpEuler.setFromQuaternion(
            _tmpQuat.set(bodyQuat.x, bodyQuat.y, bodyQuat.z, bodyQuat.w),
            "XYZ"
          );
          
          const isFlipped =
            _tmpEuler.x > Math.PI / 2 ||
            _tmpEuler.x < -Math.PI / 2 ||
            _tmpEuler.z !== 0 ||
            _tmpEuler.y !== 0;

          if (isFlipped) {
            // Apply recovery impulse and torque
            const impulse = new Vector3(0, 1, 0).multiplyScalar(chassis.mass());
            chassis.applyImpulse({ x: impulse.x, y: impulse.y, z: impulse.z }, true);

            const torque = new Vector3(1, 0, 0).multiplyScalar(2 * chassis.mass());
            chassis.applyTorqueImpulse({ x: torque.x, y: torque.y, z: torque.z }, true);
          }
        }

        // Apply engine forces
        const engineForce =
          Number(controls.forward) * accelerateForce - Number(controls.back);

        controller.setWheelEngineForce(0, engineForce);
        controller.setWheelEngineForce(1, engineForce);

        // Apply brake force
        const wheelBrake = Number(controls.brake) * brakeForce;
        for (let i = 0; i < 4; i++) {
          controller.setWheelBrake(i, wheelBrake);
        }

        // Apply steering
        const currentSteering = controller.wheelSteering(0) || 0;
        const steerDirection = Number(controls.left) - Number(controls.right);

        const steering = MathUtils.lerp(
          currentSteering,
          steerAngle * steerDirection,
          0.5,
        );

        controller.setWheelSteering(0, steering);
        controller.setWheelSteering(1, steering);

        // Air control when not on ground
        if (!ground.current) {
          const forwardAngVel = Number(controls.forward) - Number(controls.back);
          const sideAngVel = Number(controls.left) - Number(controls.right);

          _airControlAngVel.set(0, sideAngVel * t, forwardAngVel * t);
          _airControlAngVel.applyQuaternion(_tmpQuat.set(
            chassis.rotation().x,
            chassis.rotation().y,
            chassis.rotation().z,
            chassis.rotation().w
          ));
          
          const currentAngVel = chassis.angvel();
          _airControlAngVel.add(new Vector3(currentAngVel.x, currentAngVel.y, currentAngVel.z));

          chassis.setAngvel(
            { x: _airControlAngVel.x, y: _airControlAngVel.y, z: _airControlAngVel.z },
            true
          );
        }

        // Reset vehicle position
        if (controls.reset) {
          chassis.setTranslation({ x: spawn.position[0], y: spawn.position[1], z: spawn.position[2] }, true);
          const spawnRot = new Euler(...spawn.rotation);
          const spawnQuat = new Quaternion().setFromEuler(spawnRot);
          chassis.setRotation({ x: spawnQuat.x, y: spawnQuat.y, z: spawnQuat.z, w: spawnQuat.w }, true);
          chassis.setLinvel({ x: 0, y: 0, z: 0 }, true);
          chassis.setAngvel({ x: 0, y: 0, z: 0 }, true);
        }

        // Camera positioning
        const chassisTranslation = chassis.translation();
        
        if (ground.current) {
          // Camera behind chassis when on ground
          _cameraPosition.copy(cameraOffset);
          _cameraPosition.applyMatrix4(chasisMeshRef.current.matrixWorld);
        } else {
          // Camera behind velocity when in air
          const velocity = chassis.linvel();
          _cameraPosition.set(velocity.x, velocity.y, velocity.z);
          _cameraPosition.normalize();
          _cameraPosition.multiplyScalar(-10);
          _cameraPosition.add(new Vector3(chassisTranslation.x, chassisTranslation.y, chassisTranslation.z));
        }

        // Ensure camera doesn't go below chassis height
        _cameraPosition.y = Math.max(
          _cameraPosition.y,
          chassisTranslation.y + 1
        );

        // Smooth camera movement
        smoothedCameraPosition.lerp(_cameraPosition, t);
        state.camera.position.copy(smoothedCameraPosition);

        // Camera target
        chasisMeshRef.current.getWorldPosition(_bodyPosition);
        _cameraTarget.copy(_bodyPosition).add(cameraTargetOffset);
        smoothedCameraTarget.lerp(_cameraTarget, t);
        state.camera.lookAt(smoothedCameraTarget);
      } catch (e) {
        console.error("Error in RacingVehicle update:", e);
      }
    });

    return (
      <>
        <RigidBody
          position={props.position}
          rotation={props.rotation}
          canSleep={false}
          ref={chasisBodyRef}
          colliders={false}
          type={props.defaultPlayer ? "dynamic" : "fixed"}
          name="Player"
          linearDamping={0.5}
          angularDamping={0.5}
        >
          <CuboidCollider args={[0.8, 0.2, 0.4]} />

          {/* chassis */}
          <mesh ref={chasisMeshRef}>
            <boxGeometry args={[1.6, 0.4, 0.8]} />
            <meshStandardMaterial color="#4080c0" />
          </mesh>

          {/* wheels */}
          {wheels.map((wheel, index) => (
            <group
              key={index}
              ref={(ref) => {
                if (ref) wheelsObjectsRef.current[index] = ref;
              }}
              position={wheel.position}
            >
              <group rotation-x={-Math.PI / 2}>
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
        </RigidBody>
      </>
    );
  },
);

RacingVehicle.displayName = "RacingVehicle";