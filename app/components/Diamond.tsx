import {
  Physics,
  usePlane,
  useConvexPolyhedron,
  ConvexPolyhedronArgs,
  Triplet,
  useBox,
} from "@react-three/cannon";
import { useGLTF } from "@react-three/drei";
import { Geometry } from "three-stdlib";
import { useMemo } from "react";
import * as THREE from "three";

/**
 * Returns legacy geometry vertices, faces for ConvP
 * @param {THREE.BufferGeometry} bufferGeometry
 
 export declare type ConvexPolyhedronArgs<V extends VectorTypes = VectorTypes> = [
  vertices?: V[],
  faces?: number[][],
  normals?: V[],
  axes?: V[],
  boundingSphereRadius?: number
];

*/
function toConvexProps(
  bufferGeometry: THREE.BufferGeometry,
): ConvexPolyhedronArgs {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  geo.mergeVertices();

  const vertices: Triplet[] = geo.vertices.map(
    (v) => [v.x, v.y, v.z] as Triplet,
  ); // ✅ Type assuré
  const faces = geo.faces.map((f) => [f.a, f.b, f.c]); // Pas de changement ici
  const normals: Triplet[] = []; // Ajout d'un tableau vide avec le bon type
  const axes: Triplet[] = []; // Idem
  const boundingSphereRadius = undefined; // Valeur optionnelle

  return [vertices, faces, normals, axes, boundingSphereRadius];
}

export function Diamond() {
  const { nodes } = useGLTF("diamond.glb");

  //useBox 

  const [ref] = useConvexPolyhedron(() => ({
    mass: 1,
    args: toConvexProps((nodes.Cylinder as THREE.Mesh).geometry),
    position: [0, 0, 0],
    onCollide: () => {console.log('collide')},
    type: "Kinematic",
  }));
  return (
    <mesh
      castShadow
      receiveShadow
      ref={ref}
      geometry={(nodes.Cylinder as THREE.Mesh).geometry}
    >
      <meshStandardMaterial wireframe color="red" />
    </mesh>
  );
}
