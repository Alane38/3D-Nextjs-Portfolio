import { useTrimesh } from '@react-three/cannon'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

export function FlatMap() {
  const { nodes } = useGLTF('/assets/model/FlatMap.glb')

  if (!nodes.Cube) {
    console.error('Le modèle ne contient pas de noeud Cube !')
    return null;
  }

  let geometry = (nodes.Cube as THREE.Mesh).geometry

  // Vérification que la géométrie est bien triangulée
  geometry = new THREE.BufferGeometry().copy(geometry);
  geometry = BufferGeometryUtils.mergeVertices(geometry);

  const positionArray = Array.from(geometry.attributes.position.array);
  const indexArray = geometry.index ? Array.from(geometry.index.array) : [];

  console.log('Position Array:', positionArray);
  console.log('Index Array:', indexArray);

  const [ref] = useTrimesh(() => ({
    mass: 0,
    position: [0, 0, 0],
    args: [positionArray, indexArray], 
    type: 'Static',
  }));

  useEffect(() => {
    console.log('Trimesh args:', positionArray, indexArray);
    if (ref.current) {
      console.log('Collision active:', ref.current);
    } else {
      console.log('Référence non encore assignée');
    }
  }, [ref]);

  return <primitive object={nodes.Cube} ref={ref} receiveShadow />;
}

useGLTF.preload('/assets/model/FlatMap.glb')
