import { JSX, useEffect, useMemo, useRef } from "react";
import { Group } from "three";
import { useMoveToolStore } from "../client/inventory/move-tool/store/useMoveTool.store";
import { Entity } from "./Entity";

export function createEntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (object: T) => JSX.Element,
  useMoveTool = true,
) {
  return ({ model, ...props }: { model?: T } & Partial<T>) => {
    const instance = useRef<T>(model ?? new EntityClass());

    useEffect(() => {
      if (model) {
        instance.current = model;
      }
    }, [model]);

    const object = useMemo(() => {
      return { ...instance.current, ...props };
    }, [props]);

    const bodyRef = useRef<Group>(null);
    const { setPosition, setSelectedGroup, selectedGroup } = useMoveToolStore((s) => s);

    return (
      <>
      <group
        ref={bodyRef}
        onPointerDown={(e) => {
          if (useMoveTool) {
            e.stopPropagation();
            if (!bodyRef.current) return;
            setSelectedGroup(bodyRef.current);
            setPosition(object.position);
          }
        }}
        {...object}
      >
        {RenderMesh(object)}
      </group>

      </>
    );
  };
}