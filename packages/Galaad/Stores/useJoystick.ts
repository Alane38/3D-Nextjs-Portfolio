import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export const useJoystick = create(
  subscribeWithSelector<State>((set, get) => ({
    // Joystick state management
    curJoystickDis: 0,
    curJoystickAng: 0,
    curRunState: false,
    curButton1Pressed: false,
    curButton2Pressed: false,
    curButton3Pressed: false,
    curButton4Pressed: false,
    curButton5Pressed: false,

    setJoystick: (joystickDis: number, joystickAng: number, runState: boolean) => {
      set({ curJoystickDis: joystickDis, curJoystickAng: joystickAng, curRunState: runState });
    },

    resetJoystick: () => set({
      curJoystickDis: 0,
      curJoystickAng: 0,
      curRunState: false
    }),

    // Press button utility
    pressButton: (buttonId: number) => {
      set((state) => {
        const buttonKey = `curButton${buttonId}Pressed` as keyof State;
        if (!state[buttonKey]) {
          return { [buttonKey]: true };
        }
        return {};
      });
    },

    releaseButton: (buttonId: number) => {
      set((state) => {
        const buttonKey = `curButton${buttonId}Pressed` as keyof State;
        if (state[buttonKey]) {
          return { [buttonKey]: false };
        }
        return {};
      });
    },

    releaseAllButtons: () => {
      set({
        curButton1Pressed: false,
        curButton2Pressed: false,
        curButton3Pressed: false,
        curButton4Pressed: false,
        curButton5Pressed: false,
      });
    },

    getJoystickValues: () => ({
      joystickDis: get().curJoystickDis,
      joystickAng: get().curJoystickAng,
      runState: get().curRunState,
      button1Pressed: get().curButton1Pressed,
      button2Pressed: get().curButton2Pressed,
      button3Pressed: get().curButton3Pressed,
      button4Pressed: get().curButton4Pressed,
      button5Pressed: get().curButton5Pressed,
    }),
  }))
);

type State = {
  curJoystickDis: number;
  curJoystickAng: number;
  curRunState: boolean;
  curButton1Pressed: boolean;
  curButton2Pressed: boolean;
  curButton3Pressed: boolean;
  curButton4Pressed: boolean;
  curButton5Pressed: boolean;
  setJoystick: (joystickDis: number, joystickAng: number, runState: boolean) => void;
  resetJoystick: () => void;
  pressButton: (buttonId: number) => void;
  releaseButton: (buttonId: number) => void;
  releaseAllButtons: () => void;
  getJoystickValues: () => {
    joystickDis: number;
    joystickAng: number;
    runState: boolean;
    button1Pressed: boolean;
    button2Pressed: boolean;
    button3Pressed: boolean;
    button4Pressed: boolean;
    button5Pressed: boolean;
  };
};
