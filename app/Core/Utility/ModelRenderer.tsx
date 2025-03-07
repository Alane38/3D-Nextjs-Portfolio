import { useFrame, useLoader } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";
import { AnimationMixer, LoopPingPong, LoopRepeat } from "three";
import { useEffect, useRef } from "react";

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

    const mixerRef = useRef<AnimationMixer | null>(null);

    useEffect(() => {
      // animate the model if it has animations
      if (gltf.animations.length > 0) {
        const mixer = new AnimationMixer(gltf.scene);
        mixerRef.current = mixer;

        gltf.animations.forEach((clip) => {
          if (clip.name === "idle") {
            const action = mixer.clipAction(clip);
            // console.log(action);
            action.setLoop(LoopPingPong, Infinity);
            action.play();
          }
        });
      }
    }, [gltf]);

    useFrame((_, delta) => {
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
    });

    return <primitive object={gltf.scene} />;
  }
};
