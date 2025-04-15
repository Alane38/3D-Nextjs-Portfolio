import { MoveTool } from "./move/MoveTool";
import { ScaleTool } from "./scale/ScaleTool";

/**
 * Resume Tool
 * Add this to a world to allow the user to use tools.
 *
 * @component
 * @returns {JSX.Element}
 */
export const EditTool = () => {
    return (
        <>
            <MoveTool />
            <ScaleTool />
        </>
    );
};