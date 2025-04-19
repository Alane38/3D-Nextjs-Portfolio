import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat } from "@react-three/rapier";
import { modelPath } from "src/constants/default";
import { Quaternion, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

/**
 * An entity class
 * 
 * @class
 * @extends Entity
 */
export class Spinner extends Entity {
  /** Rotation speed */
  speed: number;

  /** Color */
  color: string;

  /**
   * Creates a new instance
   * Initializes with rotation and path settings
   */
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
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {SpinnerComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const SpinnerComponent = EntityComponent(Spinner, (instance, rigidBodyRef) => {
  /** 
   * Renders the 3D model and handles spinning
   * 
   * @function
   * @param {EntityComponent} EntityTemplate - A default entity class
   * @param {Spinner} instance - An entity from the Entity parent
   * @param {RapierRigidBody} rigidBodyRef - Reference to the RapierRigidBody instance
   */
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
