import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useEffect, useRef } from "react";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import * as THREE from "three";

export function EntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (
    object: T,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<THREE.Group | null>,
  ) => JSX.Element,
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
    const visualRef = useRef<THREE.Group>(null);
    const { setPosition, setSelectedGroup, setSelectedVisual } =
      useEditToolStore();

    const object = instance.current;
    Object.assign(object, props);

    return (
      <RigidBody
        ref={bodyRef}
        onPointerDown={(e: PointerEvent) => {
          if (useMoveTool) {
            e.stopPropagation();
            if (!bodyRef.current) return;
            setSelectedGroup(bodyRef.current);
            setSelectedVisual(visualRef.current);
            setPosition(object.position);
          }
        }}
        onCollisionEnter={object.onCollisionEnter}
        {...object}
      >
        { visualRef ? <group ref={visualRef}>{RenderMesh(object, bodyRef, visualRef)}</group> : RenderMesh(object, bodyRef)}
      </RigidBody>
    );
  };
}
