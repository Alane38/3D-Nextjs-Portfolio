import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RapierRigidBody } from "@react-three/rapier";
import { modelPath } from "src/constants/default";
import { Quaternion, Vector3 } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";
import { RefObject } from "react";
import { useWorldRigidBody } from "@/hooks/useWorldRigidBody";

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

const SpinnerRenderer = ({
  instance,
  rigidBodyRef,
}: {
  instance: Spinner;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
}) => {
  const rigidBody = useWorldRigidBody(rigidBodyRef);
  useFrame((_state, delta) => {
    if (!rigidBody) return;

    const curRotation = quat(rigidBody.rotation());
    const incrementRotation = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      delta * instance.speed,
    );
    curRotation.multiply(incrementRotation);
    rigidBody.setNextKinematicRotation(curRotation);
  });

  console.log("Rendering spinner", instance.speed);

  return (
    <group>
      <Box args={[1, 0.5, 5]} />
      <meshStandardMaterial color={instance.color} />
    </group>
  );
};

/**
 * Component responsible for rendering the entity
 *
 * @component
 * @param  {SpinnerComponent} entity - Contains all the default props of the entity
 * @returns {JSX.Element} The rendered 3D object
 */
export const SpinnerComponent = EntityComponent(
  Spinner,
  (instance, rigidBodyRef) => {
    return <SpinnerRenderer instance={instance} rigidBodyRef={rigidBodyRef} />;
  },
);
