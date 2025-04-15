import { useAnimations, useFBX } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import { useGame } from "./store/useGame";
import { ArcheAnimationProps } from "./types/ArcheAnimationProps";

interface ActionType extends THREE.AnimationAction {
  _mixer: THREE.AnimationMixer;
}

export function ArcheAnimation(props: ArcheAnimationProps) {
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
    const action: ActionType | null = actions[curAnimation] as ActionType | null;
    if (!action) return;
  
    const isOneShot =
      curAnimation === props.animationSet.jump ||
      curAnimation === props.animationSet.jumpLand ||
      curAnimation === props.animationSet.action1 ||
      curAnimation === props.animationSet.action2 ||
      curAnimation === props.animationSet.action3 ||
      curAnimation === props.animationSet.action4;
  
    if (isOneShot) {
      action.reset().fadeIn(0.2).setLoop(THREE.LoopOnce, 1).play();
      action.clampWhenFinished = true;
    } else {
      action.reset().fadeIn(0.2).play();
    }
  
    const onFinish = () => resetAnimation();
    action._mixer.addEventListener("finished", onFinish);
  
    return () => {
      action.fadeOut(0.2);
      action._mixer.removeEventListener("finished", onFinish); // ✅ Proper cleanup
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
