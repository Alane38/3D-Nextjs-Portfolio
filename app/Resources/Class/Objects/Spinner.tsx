import { classModelPath } from "@constants/default";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { Entity } from "../Entity";

export class Spinner extends Entity {
  speed: number;
  color: string;
  constructor(path: string = classModelPath + "Spinner.glb") {
    super("Spinner");
    this.path = path;
    this.type = "kinematicPosition";
    this.speed = 5;
    this.color = "blue";
  }
  renderComponent() {
    return <SpinnerComponent model={this} />;
  }
}

export const SpinnerComponent = ({
  model,
  ...props
}: { model?: Spinner } & Partial<Spinner>) => {
  const object = useMemo(() => {
    return { ...new Spinner(), ...model, ...props };
  }, [model, props]);

  const kicker = object.ref;

  useFrame((_state, delta) => {
    if (!kicker.current || !kicker.current.rotation()) return;

    const curRotation = quat(kicker.current?.rotation());
    const incrementRotation = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      delta * object.speed,
    );
    curRotation.multiply(incrementRotation);
    kicker.current?.setNextKinematicRotation(curRotation);
  });

  return (
    <RigidBody {...object}>
      <group>
        <Box args={[1, 0.5, 5]} />
        <meshStandardMaterial color={object.color} />
      </group>
    </RigidBody>
  );
};
