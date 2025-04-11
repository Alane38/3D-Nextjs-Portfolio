import {
  Vector2,
  MeshStandardMaterialParameters,
  ExtrudeGeometry,
  Shape,
} from "three";

class PrismGeometry extends ExtrudeGeometry {
  constructor(vertices: Vector2[], height: number) {
    super(new Shape(vertices), { depth: height, bevelEnabled: false });
  }
}

interface PrismProps {
  vertices: Vector2[];
  height: number;
  materialProps?: MeshStandardMaterialParameters;
}

export const PrismGeometryComponent = ({
  vertices,
  height,
  materialProps,
}: PrismProps) => {
  const prismGeom = new PrismGeometry(vertices, height);

  return (
    <mesh geometry={prismGeom}>
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
};
