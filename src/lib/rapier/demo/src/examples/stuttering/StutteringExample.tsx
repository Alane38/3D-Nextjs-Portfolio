import { Torus } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { useRef } from "react";
import { Mesh } from "three";

export const StutteringExample = () => {
  const body = useRef<RapierRigidBody>(null);
  const bodyModel = useRef<Mesh>(null);
  const model = useRef<Mesh>(null);

  const { camera } = useThree();

  useFrame(() => {
    if (body.current) {
      const now = performance.now();
      const pos = vec3({ x: (now / 100) % 100, y: 0, z: 0 });

      body.current.setTranslation(pos, true);

      pos.y += 15;
      pos.z += 15;
      camera.position.lerp(pos, 0.04);
      camera.lookAt(bodyModel.current?.getWorldPosition(vec3())!);
    }
  });

  return (
    <group rotation={[0, 0, 0]} scale={1}>
      <RigidBody
        ref={body}
        position={[0, 15, 0]}
        colliders="hull"
        enabledTranslations={[true, false, false]}
        restitution={1}
      >
        <Torus castShadow scale={3} receiveShadow ref={bodyModel}>
          <meshPhysicalMaterial />
        </Torus>
      </RigidBody>

      <Torus ref={model} />
    </group>
  );
};
