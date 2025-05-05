import { create } from "zustand";

 // eslint-disable-next-line
const useDebugStore = create((set) => ({
    debugState: false,
    setDebugState: (state: boolean) => {
        set(() => ({ debugState: state }));
    },
}));