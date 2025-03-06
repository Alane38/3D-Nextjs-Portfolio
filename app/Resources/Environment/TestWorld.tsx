import {
  RacingVehicle,
  racingVehicleControls,
} from "@core/Player/Vehicles/RacingCar/RacingVehicle";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { Ground, GroundComponent } from "../Class/Ground";
import {
  ExtrudeGeometry,
  MeshStandardMaterialParameters,
  Shape,
  Vector2,
  Vector3,
} from "three";
import { RigidBody } from "@react-three/rapier";

class PrismGeometry extends ExtrudeGeometry {
  constructor(vertices: Vector2[], height: number) {
    super(new Shape(vertices), { depth: height, bevelEnabled: false });
  }
}

// Interface pour le composant Prism
interface PrismProps {
  vertices: Vector2[];
  height: number;
  materialProps?: MeshStandardMaterialParameters;
}

const PrismGeometryComponent: React.FC<PrismProps> = ({
  vertices,
  height,
  materialProps,
}) => {
  const prismGeom = new PrismGeometry(vertices, height);

  return (
    <mesh geometry={prismGeom}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};

export const TestWorld = () => {
  const ground = new Ground();
  // prims
  const A = new Vector2(9, 1);
  const B = new Vector2(0, -4);

  return (
    <>
      <OrbitControls />

      <GroundComponent model={ground} />

      {/* <CharacterController /> */}

      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 1, 7]}
        rotation={[0, Math.PI, Math.PI]}
      >
        <PrismGeometryComponent vertices={[A, B]} height={20} />
      </RigidBody>

      <KeyboardControls map={racingVehicleControls}>
        <RacingVehicle
          position={[4, 2, 0]}
          rotation={[0, Math.PI / 2, Math.PI]}
        />
      </KeyboardControls>
    </>
  );
};
