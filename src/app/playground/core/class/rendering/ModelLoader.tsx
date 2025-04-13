import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { ReactNode, useEffect, useRef } from "react";
import { AnimationMixer, LoopRepeat } from "three";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export const ModelLoader = ({
  path,
  children,
}: {
  path: string;
  children?: ReactNode;
}) => {
  // Preload the model to improve loading performance
  useGLTF.preload(path);

  if (path.endsWith(".gltf")) {
    // Load .gltf files using useGLTF for better integration with Drei
    const { scene } = useGLTF(path);
    return <primitive object={scene}>{children}</primitive>;
  } else if (path.endsWith(".glb")) {
    // Load .glb files using GLTFLoader with DRACOLoader for optimization
    const gltf = useLoader(GLTFLoader, path, (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
      loader.setDRACOLoader(dracoLoader);
    });

    return <primitive  object={gltf.scene.clone()}>{children}</primitive>;
  }
};
