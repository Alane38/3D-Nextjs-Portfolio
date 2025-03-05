import { useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

export const ModelRenderer = ({ path }: { path: string }) => {
  // Preload the model to improve loading performance
  useGLTF.preload(path);

  if (path.endsWith(".gltf")) {
    // Load .gltf files using useGLTF for better integration with Drei
    const { scene } = useGLTF(path);
    return <primitive object={scene} />;
  } else {
    // Load .glb files using GLTFLoader with DRACOLoader for optimization
    const gltf = useLoader(GLTFLoader, path, (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
      loader.setDRACOLoader(dracoLoader);
    });

    return <primitive object={gltf.scene} />;
  }
};
