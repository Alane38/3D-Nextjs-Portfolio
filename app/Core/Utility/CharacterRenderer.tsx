import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { AnimationMixer, LoopRepeat } from "three";
import { ReactNode, useEffect, useRef } from "react";

export const CharacterRenderer = ({
  path,
  children,
}: {
  path: string;
  children?: ReactNode;
}) => {
  // const game = useGame();

  // Preload the FBX model
  useFBX.preload(path);

  // Load the FBX model
  const object = useFBX(path);
  const mixerRef = useRef<AnimationMixer | null>(null);

  useEffect(() => {
    // console.log(game.curAnimation);
    if (object.animations.length > 0) {
      const mixer = new AnimationMixer(object);
      mixerRef.current = mixer;

      object.animations.forEach((clip) => {
        // if (
        //   game.curAnimation === undefined &&
        //   clip.name.toLowerCase().includes("walk")
        // ) {
        //   const action = mixer.clipAction(clip);
        //   action.setLoop(LoopRepeat, Infinity);
        //   action.play();
        // } else if (
        //   game.curAnimation === "jump" &&
        //   clip.name.toLowerCase().includes("jump")
        // ) {
        //   const action = mixer.clipAction(clip);
        //   action.setLoop(LoopRepeat, Infinity);
        //   action.play();
        // }
      });
    }
  }, [object]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <primitive scale={0.013} object={object}>
      {children}
    </primitive>
  );
};
