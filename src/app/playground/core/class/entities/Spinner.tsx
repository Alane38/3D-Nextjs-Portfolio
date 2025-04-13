import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat } from "@react-three/rapier";
import { modelPath } from "src/constants/default";
import { Quaternion, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Spinner extends Entity {
  speed: number;
  color: string;
  constructor(path: string = modelPath + "Spinner.glb") {
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

export const SpinnerComponent = EntityComponent(Spinner, (object, rigidBodyRef) => {
  useFrame((_state, delta) => {
    if (!rigidBodyRef.current?.rotation()) return;

    const curRotation = quat(rigidBodyRef.current.rotation());
    const incrementRotation = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      delta * object.speed,
    );
    curRotation.multiply(incrementRotation);
    rigidBodyRef.current.setNextKinematicRotation(curRotation);
  });

  return (
    <group>
      <Box args={[1, 0.5, 5]} />
      <meshStandardMaterial color={object.color} />
    </group>
  );
});
