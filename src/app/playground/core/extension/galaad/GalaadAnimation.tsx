import { useAnimations, useFBX } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "./store/useGame";
import { GalaadAnimationProps } from "./types/GalaadAnimationProps";

export function GalaadAnimation(props: GalaadAnimationProps) {
  // Change the character src to yours
  const group = useRef(null!);
  const fbx = useFBX(props.path);
  const animations = fbx.animations;
  const { actions } = useAnimations(animations, group);

  // // Character animations setup

  const curAnimation = useGame((state) => state.curAnimation);
  const resetAnimation = useGame((state) => state.reset);
  const initializeAnimationSet = useGame(
    (state) => state.initializeAnimationSet,
  );

  useEffect(() => {
    // Initialize animation set
    initializeAnimationSet(props.animationSet);
  }, []);

  useEffect(() => {
    // Play animation
    const action = actions[curAnimation];

    // For jump and jump land animation, only play once and clamp when finish
    if (!action) return;
    if (
      curAnimation === props.animationSet.jump ||
      curAnimation === props.animationSet.jumpLand ||
      curAnimation === props.animationSet.action1 ||
      curAnimation === props.animationSet.action2 ||
      curAnimation === props.animationSet.action3 ||
      curAnimation === props.animationSet.action4
    ) {
      action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 1).play();
      action.clampWhenFinished = true;
    } else {
      action.reset().fadeIn(0.2).play();
    }

    // When any action is clamp and finished reset animation
    (action as any)._mixer.addEventListener("finished", () => resetAnimation());

    return () => {
      // Fade out previous action
      action.fadeOut(0.2);

      // Clean up mixer listener, and empty the _listeners array
      (action as any)._mixer.removeEventListener("finished", () =>
        resetAnimation(),
      );
      (action as any)._mixer._listeners = [];
    };
  }, [curAnimation]);

  return (
    <Suspense fallback={null}>
      <group
        ref={group}
        dispose={null}
        userData={{ camExcludeCollision: true }}
      >
        <primitive {...props.rigidBodyProps} object={fbx} />
        {/* Replace character model here */}
        {props.children}
      </group>
    </Suspense>
  );
}
