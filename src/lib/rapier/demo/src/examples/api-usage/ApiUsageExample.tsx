import { Torus } from "@react-three/drei";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";

export const ApiUsage = () => {
  const torus = useRef<RapierRigidBody>(null);

  useResetOrbitControls();

  useEffect(() => {
    if (torus.current) {
      torus.current.applyTorqueImpulse(
        {
          x: 1,
          y: 3,
          z: 0,
        },
        true,
      );
    }

    const timer = setInterval(() => {
      if (torus.current) {
        torus.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
        torus.current.setLinvel({ x: 0, y: 5, z: 0 }, true);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <group rotation={[0, 0, 0]} scale={1}>
      <RigidBody colliders="hull" ref={torus} restitution={2}>
        <Torus castShadow>
          <meshPhysicalMaterial />
        </Torus>
      </RigidBody>
    </group>
  );
};
