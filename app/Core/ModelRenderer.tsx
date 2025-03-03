import { useGLTF } from "@react-three/drei";

export const ModelRenderer = ({ path }: { path: string }) => {
  const gltf = useGLTF(path);

  return <primitive object={gltf.scene.clone()} />;
};
