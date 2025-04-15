import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useEffect, useRef } from "react";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import EntityManager from "./EntityManager";
import { Euler, Group, Vector3 } from "three";

export function EntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (
    object: T,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<Group | null>
  ) => JSX.Element,
  useMoveTool = true,
) {
  const WrappedEntityComponent = ({ model, ...props }: { model?: T } & Partial<T>) => {
    const entityManager = EntityManager.getInstance();

    const instance = useRef<T>(entityManager.createEntity(EntityClass) as T);
    const object = instance.current;
    Object.assign(object, props);

    useEffect(() => {
      if (model) {
        Object.assign(instance.current, model);
      }
    }, [model]);

    const bodyRef = useRef<RapierRigidBody>(null);
    const visualRef = useRef<Group>(null);
    const pendingUpdate = useRef<T | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);

    const {
      setPosition,
      setSelectedEntity,
      setSelectedGroup,
      setSelectedVisual,
    } = useEditToolStore();

    const { updateEntity } = useEntityStore();

    useEffect(() => {
      const id = setInterval(() => {
        if (pendingUpdate.current) {
          updateEntity((e) => {
            if (e.entityId === object.entityId) {
              e.position = pendingUpdate.current!.position;
              e.rotation = pendingUpdate.current!.rotation;
              e.scale = pendingUpdate.current!.scale;
            }
            return e;
          });

          pendingUpdate.current = null;
        }
      }, 5000);

      return () => clearInterval(id);
    }, []);

    useFrame(() => {
      const now = performance.now();
      if (now - lastUpdateTimeRef.current >= 5000) {
        if (!bodyRef.current || !visualRef.current) return;

        const pos = bodyRef.current.translation();
        const rot = bodyRef.current.rotation();
        const scale = visualRef.current.scale;

        pendingUpdate.current = {
          ...object,
          position: new Vector3(pos.x, pos.y, pos.z),
          rotation: new Euler(rot.x, rot.y, rot.z),
          scale: [scale.x, scale.y, scale.z],
        };

        lastUpdateTimeRef.current = now;
      }
    });

    return (
      <RigidBody
        ref={bodyRef}
        onPointerDown={(e: PointerEvent) => {
          if (useMoveTool) {
            e.stopPropagation();
            if (!bodyRef.current) return;
            setSelectedEntity(object);
            setSelectedGroup(bodyRef.current);
            setSelectedVisual(visualRef.current);
            setPosition(object.position);
          }
        }}
        {...object}
      >
        <group ref={visualRef}>
          {RenderMesh(object, bodyRef, visualRef)}
        </group>
      </RigidBody>
    );
  };

  // ✅ Set display name to fix lint error
  WrappedEntityComponent.displayName = `EntityComponent(${EntityClass.name})`;

  return WrappedEntityComponent;
}
