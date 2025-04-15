import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { ReactNode } from "react";
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

  const isGLTF = path.endsWith(".gltf");
  const isGLB = path.endsWith(".glb");

  // Load both hooks unconditionally (safe because Drei/Three.js won't break if path is nonsense for one of them)
  const gltfFromGLTF = useGLTF(path); // will only be valid if isGLTF
  const gltfFromGLB = useLoader(GLTFLoader, path, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  // Then conditionally render
  if (isGLTF) {
    return <primitive object={gltfFromGLTF.scene}>{children}</primitive>;
  } else if (isGLB) {
    return <primitive object={gltfFromGLB.scene.clone()}>{children}</primitive>;
  } else {
    return null; // or an error fallback
  }
};
