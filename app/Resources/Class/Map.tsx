/* import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import * as THREE from "three";


export const Map = ({ scale, position, model, ...props }: { scale: number; position: [number, number, number]; model: string }) => {
  const { scene, animations } = useGLTF(model);
  const group = useRef<any>(null);
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (actions && animations.length > 0) {
      if (actions && animations[0]) {
        actions[animations[0].name]?.play();
      }
    }
  }, [actions]);

  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} {...props} ref={group} />
      </RigidBody>
    </group>
  );
}; */