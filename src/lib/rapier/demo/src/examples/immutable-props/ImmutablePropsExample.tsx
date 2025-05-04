import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody, euler, quat } from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";

export const ImmutablePropsExample = () => {
  const [canSleep, setCanSleep] = useState(true);
  const rb = useRef<RapierRigidBody>(null);

  useResetOrbitControls(30);

  useControls({
    canSleep: {
      value: canSleep,
      onChange: (v) => setCanSleep(v),
    },
  });

  useFrame(() => {
    let rot = performance.now() / 1000;
    rb.current!.setRotation(
      quat().setFromEuler(euler({ x: 0, y: rot, z: 0 })),
      true,
    );
  });

  return (
    <group>
      <RigidBody type="fixed" ref={rb} canSleep={canSleep}>
        <Box />
      </RigidBody>
    </group>
  );
};
