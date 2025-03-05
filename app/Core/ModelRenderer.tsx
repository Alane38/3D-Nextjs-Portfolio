import { useLoader } from "@react-three/fiber";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

// Function to import models
export const ModelRenderer = ({ path }: { path: string }) => {
  const gltf = useLoader(GLTFLoader, path, (loader) => {
    const dracoLoader = new DRACOLoader(); // Optimization with DRACOLoader
    dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  return <primitive object={gltf.scene.clone()} />; 
};
