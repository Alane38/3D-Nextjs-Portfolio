import { EvaPanel } from "./EvaPanel"

interface EvaProps {
    collapsed: boolean
}

/**
 * Engine Visual Assistant
 * 
 * @component
 * @returns {JSX.Element}
 */
export function Eva({ collapsed }: EvaProps) {
    return (
        <EvaPanel collapsed={collapsed} />
    )
}