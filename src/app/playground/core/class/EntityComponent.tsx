import { JSX, useEffect, useMemo, useRef } from "react";
import { useMoveToolStore } from "../client/inventory/move-tool/store/useMoveTool.store";
import { Entity } from "./Entity";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

export function EntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (object: T, rigidBodyRef: React.RefObject<RapierRigidBody | null> ) => JSX.Element,
  useMoveTool = true,
) {
  return ({ model, ...props }: { model?: T } & Partial<T>) => {
    const instance = useRef<T>(model ?? new EntityClass());

    useEffect(() => {
      if (model) {
        instance.current = model;
      }
    }, [model]);

    const bodyRef = useRef<RapierRigidBody>(null);
    const { setPosition, setSelectedGroup } = useMoveToolStore((s) => s);
    
    const object = useMemo(() => {
      return { ...instance.current, ...props };
    }, [props]);
    
    return (
      <RigidBody
        ref={bodyRef}
        onPointerDown={(e: PointerEvent) => {
          if (useMoveTool) {
            e.stopPropagation();
            if (!bodyRef.current) return;
            setSelectedGroup(bodyRef.current);
            setPosition(object.position);
          }
        }}
        {...object}
      >
        {RenderMesh(object, bodyRef)}
      </RigidBody>
    );
  };
}