import { useFrame } from "@react-three/fiber";
import { useEditToolStore } from "../store/useEditTool.store";

export const ScaleTool = () => {
  const {
    scaleToolEnabled,
    scale,
    setScale,
    selectedVisual,
    position,
    scaleMode,
  } = useEditToolStore();

  useFrame(() => {
    if (!selectedVisual || !scaleToolEnabled) return;
    selectedVisual.scale.set(scale.x, scale.y, scale.z);
  });

  if (!selectedVisual || !scaleToolEnabled) return null;

  const handleUniformScale = (amount: number) => {
    const newVal = {
      x: scale.x + amount,
      y: scale.y + amount,
      z: scale.z + amount,
    };
    setScale(newVal);
  };

  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, Math.PI, 0]}>
      {/* Échelle Y */}
      <mesh
        position={[0, 1.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (scaleMode === "uniform") {
            handleUniformScale(0.1);
          } else {
            setScale((s) => ({ ...s, z: s.z + 0.1 }));
          }
        }}
        
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>

      {/* Échelle X */}
      <mesh
        position={[1.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => {
          e.stopPropagation();
          if (scaleMode === "uniform") {
            handleUniformScale(0.1);
          } else {
            setScale((s) => ({ ...s, z: s.z + 0.1 }));
          }
        }}
        
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Échelle Z */}
      <mesh
        position={[0, 0, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (scaleMode === "uniform") {
            handleUniformScale(0.1);
          } else {
            setScale((s) => ({ ...s, z: s.z + 0.1 }));
          }
        }}
        
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
};
