import { useControls } from "leva";

export const useMainText = () => {
    const { TextSize, TextV } = useControls("Text Size", {
      TextSize: {
        value: 0.2,
        step: 0.1,
      },
      TextV: {
        value: "NEWALFOX",
      },
    });
    return { TextSize, TextV };
}