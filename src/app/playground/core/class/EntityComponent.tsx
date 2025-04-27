import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { JSX, useRef, useEffect } from "react";
import { Group, Vector3, Euler } from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import { EntityManager } from "./EntityManager";
import { useWorldRigidBody } from "@/hooks/useWorldRigidBody";

export function EntityComponent<InstanceType extends Entity>(
  EntityTemplate: new () => InstanceType,
  onRender: (
    currentInstance: InstanceType,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<Group | null>,
  ) => JSX.Element,
  useEditTool = true,
) {
  const WrappedEntityComponent = React.memo(
    ({
      entity, 
      ...props
    }: { entity?: InstanceType } & Partial<InstanceType>) => {
      const bodyRef = useRef<RapierRigidBody>(null);
      const visualRef = useRef<Group>(null);
      const pendingUpdate = useRef<InstanceType | null>(null);
      const lastUpdateTimeRef = useRef<number>(0);
      
      const rigidBody = useWorldRigidBody(bodyRef);

      const {
        setPosition,
        setSelectedEntity,
        setSelectedGroup,
        setSelectedVisual,
      } = useEditToolStore();

      const { updateEntity } = useEntityStore();
      const instanceRef = useRef<InstanceType | null>(
        entity ?? new EntityTemplate(),
      );

      const currentInstance = instanceRef.current;

      useEffect(() => {
        if (!currentInstance) return;

        if (!currentInstance.entityId) {
          currentInstance.entityId = EntityManager.generateIdToEntity(
            currentInstance,
          );
        }

        if (props) {
          Object.assign(currentInstance, props);
        }
      }, []);

      const UpdateEntity = () => {
        useEffect(() => {
          if (!currentInstance) return;

          const id = setInterval(() => {
            if (pendingUpdate.current) {
              updateEntity((e) => {
                if (e.entityId === currentInstance.entityId) {
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
          if (!currentInstance || !rigidBody) return;
          const now = performance.now();
          if (now - lastUpdateTimeRef.current >= 5000) {
            if (!rigidBody || typeof rigidBody.translation !== "function" || !visualRef.current) return;

            const pos = rigidBody.translation();
            const rot = rigidBody.rotation();
            const scale = visualRef.current.scale;

            pendingUpdate.current = {
              ...currentInstance,
              position: new Vector3(pos.x, pos.y, pos.z),
              rotation: new Euler(rot.x, rot.y, rot.z),
              scale: [scale.x, scale.y, scale.z],
            };

            lastUpdateTimeRef.current = now;
          }
        });

        return null; 
      };

      if (!currentInstance) return null;

      return (
        <>
          <UpdateEntity />
          <RigidBody
            ref={bodyRef}
            onPointerDown={(e: PointerEvent) => {
              if (useEditTool) {
                e.stopPropagation();
                if (!rigidBody || !currentInstance || !visualRef.current) return;
                setSelectedEntity(currentInstance);
                setSelectedGroup(rigidBody);
                setSelectedVisual(visualRef.current);
                setPosition(currentInstance.position);
              }
            }}
            {...currentInstance}
          >
            <group ref={visualRef}>
              {onRender(currentInstance, bodyRef, visualRef)}
            </group>
          </RigidBody>
        </>
      );
    },
  );

  WrappedEntityComponent.displayName = `EntityComponent(${EntityTemplate.name})`;

  return WrappedEntityComponent;
}
