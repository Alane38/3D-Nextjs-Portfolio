import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { Raycaster, Plane, Vector3, Vector2 } from "three";
import { useEditToolStore } from "../store/useEditTool.store";

export const MoveTool = () => {
  const {
    moveToolEnabled,
    selectedGroup,
    dragging,
    axis,
    setPosition,
    setDragging,
    setAxis,
    position,
  } = useEditToolStore((s) => s);

  
  const { camera, pointer } = useThree();
  const raycaster = useRef(new Raycaster());
  const dragPlane = useRef(new Plane());
  const lastIntersection = useRef<Vector3 | null>(null);
  const pointerVec = new Vector2();
  
  useEffect(() => {
    const handleUp = () => {
      setDragging(false);
      setAxis(null);
      lastIntersection.current = null;
    };
    window.addEventListener("pointerup", handleUp);
    return () => window.removeEventListener("pointerup", handleUp);
  }, []);
  
  useFrame(() => {
    if (!moveToolEnabled || !selectedGroup || !axis || !dragging) return;
    
    const objectPosition = selectedGroup.translation();
    const origin = new Vector3(objectPosition.x, objectPosition.y, objectPosition.z);
    const normal = new Vector3();
    
    if (axis === "x") normal.set(0, 1, 0); // plan YZ
    if (axis === "y") normal.set(1, 0, 0); // plan XZ
    if (axis === "z") normal.set(0, 1, 0); // plan XY
    
    dragPlane.current.setFromNormalAndCoplanarPoint(normal, origin);
    
    pointerVec.set(pointer.x, pointer.y);
    raycaster.current.setFromCamera(pointerVec, camera);
    
    const intersection = new Vector3();
    const hit = raycaster.current.ray.intersectPlane(dragPlane.current, intersection);
    
    if (!hit) {
      console.debug("[Raycast] No intersection with plane");
      return;
    }
    
    if (lastIntersection.current) {
      const delta = new Vector3().subVectors(intersection, lastIntersection.current);
      const next = { ...position }; // 🛑 Important: copy position
      
      // console.debug("[Drag] Axis:", axis);
      // console.debug("[Drag] Delta:", delta);
      // console.debug("[Drag] Before position:", position);
      
      if (axis === "x") next.x += delta.x;
      if (axis === "y") next.y += delta.y;
      if (axis === "z") next.z += delta.z;
      
      selectedGroup.setTranslation(next, true);
      setPosition({ x: next.x, y: next.y, z: next.z });
      
      // console.debug("[Drag] After position:", next);
    }
    
    lastIntersection.current = intersection.clone();
  });

  // console.debug("[Render] MoveGizmo position:", position);
  
  if (!selectedGroup || !moveToolEnabled) return null;
  
  return (
    <group position={[position.x, position.y, position.z]} rotation={[0, Math.PI, 0]}>
      <mesh
        position={[1.2, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setAxis("x");
          setDragging(true);
          // console.debug("[PointerDown] X axis selected");
        }}
        onClick={(e) => {
          e.stopPropagation();
          setPosition({ ...position, x: position.x + 0.5 });
          // console.debug("[Click] Move +X");
        }}
        onPointerUp={() => {
          setDragging(false);
          // console.debug("[PointerUp] Released X handle");
        }}
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <mesh
        position={[0, 1.2, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setAxis("y");
          setDragging(true);
          // console.debug("[PointerDown] Y axis selected");
        }}
        onClick={(e) => {
          e.stopPropagation();
          setPosition({ ...position, y: position.y + 0.5 });
          // console.debug("[Click] Move +Y");
        }}
        onPointerUp={() => {
          setDragging(false);
          // console.debug("[PointerUp] Released Y handle");
        }}
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="green" />
      </mesh>

      <mesh
        position={[0, 0, 1.2]}
        rotation={[Math.PI / 2, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setAxis("z");
          setDragging(true);
          // console.debug("[PointerDown] Z axis selected");
        }}
        onClick={(e) => {
          e.stopPropagation();
          setPosition({ ...position, z: position.z + 0.5 });
          // console.debug("[Click] Move +Z");
        }}
        onPointerUp={() => {
          setDragging(false);
          // console.debug("[PointerUp] Released Z handle");
        }}
      >
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshBasicMaterial color="blue" />
      </mesh>
    </group>
  );
};
