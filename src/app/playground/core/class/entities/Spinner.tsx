import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat } from "@react-three/rapier";
import { modelPath } from "src/constants/default";
import { Quaternion, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

export class Spinner extends Entity {
      /**
   * Constructs a Killbrick entity.
   * @param {string} [path=modelPath + "NeonDoor.glb"] - Path to the .glb 3D model file.
   */
  /**
   * Add custom entity Props
   * @param {string} color - Color of the spinner
   * @param {string} speed - Speed of the spinner
   */
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
    return <SpinnerComponent entity={this} />;
  }
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {Spinner} instance - An entity from the Entity parent.
 * @param {Spinner} rigidBodyRef - Reference to the RapierRigidBody instance.
 * @returns {JSX.Element}
 */
export const SpinnerComponent = EntityComponent(Spinner, (instance, rigidBodyRef) => {
  useFrame((_state, delta) => {
    if (!rigidBodyRef.current?.rotation()) return;

    const curRotation = quat(rigidBodyRef.current.rotation());
    const incrementRotation = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      delta * instance.speed,
    );
    curRotation.multiply(incrementRotation);
    rigidBodyRef.current.setNextKinematicRotation(curRotation);
  });

  return (
    <group>
      <Box args={[1, 0.5, 5]} />
      <meshStandardMaterial color={instance.color} />
    </group>
  );
});
