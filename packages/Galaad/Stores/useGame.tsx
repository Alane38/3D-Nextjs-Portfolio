import * as THREE from "three";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { AnimationSet } from "../types/AnimationSet";
import { State } from "../types/State";

export const useGame = /* @__PURE__ */ create(
  /* @__PURE__ */ subscribeWithSelector<State>((set, get) => ({
    moveToPoint: new THREE.Vector3(),
    curAnimation: "",
    animationSet: {} as AnimationSet,

    // Initialisation de l'animation
    initializeAnimationSet: (animationSet: AnimationSet) => {
      set((state) => {
        return Object.keys(state.animationSet).length === 0
          ? { animationSet }
          : {};
      });
    },

    reset: () => {
      set((state) => ({ curAnimation: state.animationSet.idle }));
    },

    // Fonction générique pour gérer les animations
    setAnimation: (animation: string, condition: boolean = true) => {
      set((state) => {
        if (condition) {
          return { curAnimation: animation };
        }
        return {};
      });
    },

    // Gestion des animations
    idle: () => {
      const { animationSet, curAnimation } = get();
      if (curAnimation === animationSet.jumpIdle) {
        get().setAnimation(animationSet.jumpLand || "");
      } else if (![animationSet.action1, animationSet.action2, animationSet.action3, animationSet.action4].includes(curAnimation)) {
        get().setAnimation(animationSet.idle  || "");
      }
    },

    walk: () => {
      const { curAnimation, animationSet } = get();
      if (curAnimation !== animationSet.action4) {
        get().setAnimation(animationSet.walk  || "");
      }
    },

    run: () => {
      const { curAnimation, animationSet } = get();
      if (curAnimation !== animationSet.action4) {
        get().setAnimation(animationSet.run  || "");
      }
    },

    jump: () => get().setAnimation(get().animationSet.jump  || ""),

    jumpIdle: () => {
      const { curAnimation, animationSet } = get();
      if (curAnimation === animationSet.jump) {
        get().setAnimation(animationSet.jumpIdle  || "");
      }
    },

    jumpLand: () => {
      const { curAnimation, animationSet } = get();
      if (curAnimation === animationSet.jumpIdle) {
        get().setAnimation(animationSet.jumpLand  || "");
      }
    },

    fall: () => get().setAnimation(get().animationSet.fall  || ""),

    action1: () => get().setAnimation(get().animationSet.action1  || "", get().curAnimation === get().animationSet.idle),
    action2: () => get().setAnimation(get().animationSet.action2  || "", get().curAnimation === get().animationSet.idle),
    action3: () => get().setAnimation(get().animationSet.action3  || "", get().curAnimation === get().animationSet.idle),
    action4: () => {
      const { curAnimation, animationSet } = get();
      if ([animationSet.idle, animationSet.walk, animationSet.run].includes(curAnimation)) {
        get().setAnimation(animationSet.action4  || "");
      }
    },

    // Set/get point to move to
    setMoveToPoint: (point: THREE.Vector3) => {
      set(() => ({ moveToPoint: point }));
    },

    getMoveToPoint: () => ({
      moveToPoint: get().moveToPoint,
    }),
  }))
);



