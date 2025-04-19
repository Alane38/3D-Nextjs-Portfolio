import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import React, { JSX, useRef, useEffect } from "react";
import { Group, Vector3, Euler } from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import { EntityManager } from "./EntityManager";

/**
 * Higher-order component to render and manage a 3D entity with physics support.
 *
 * @param EntityTemplate - Constructor of the Entity subclass to instantiate.
 * @param onRender - Function that renders the JSX content based on the entity and refs.
 * @param useEditTool - Whether to enable edit interactions (default: true).
 * @returns A memoized React component bound to the entity instance.
 */
export function EntityComponent<InstanceType extends Entity>(
  EntityTemplate: new () => InstanceType,
  onRender: (
    currentInstance: InstanceType,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<Group | null>,
  ) => JSX.Element,
  useEditTool = true,
) {
  /**
   * Memoized React component bound to the entity instance.
   * 
   * @component
   * @param  {InstanceType} entity - Contains all the default props of the entity
   * @param  {Partial<InstanceType>} props - Additional props
   * @returns {JSX.Element} The rendered 3D object
   */
  const WrappedEntityComponent = React.memo(
    ({
      entity,
      ...props
    }: { entity?: InstanceType } & Partial<InstanceType>) => {
      // Refs
      const bodyRef = useRef<RapierRigidBody>(null);
      const visualRef = useRef<Group>(null);
      const pendingUpdate = useRef<InstanceType | null>(null);
      const lastUpdateTimeRef = useRef<number>(0);

      // Edit tool
      const {
        setPosition,
        setSelectedEntity,
        setSelectedGroup,
        setSelectedVisual,
      } = useEditToolStore();

      // Initialization
      const { updateEntity } = useEntityStore();

      const instanceRef = useRef<InstanceType | null>(null);

      useEffect(() => {
        if (!instanceRef.current) {
          instanceRef.current = entity ?? new EntityTemplate();

          if (!instanceRef.current.entityId) {
            instanceRef.current.entityId = EntityManager.generateIdToEntity(
              instanceRef.current,
            );
          }
        }
      }, []); 

      const currentInstance = instanceRef.current;

      // Save original event handlers before overriding
      const originalHandlersRef = useRef({
        onCollisionEnter: currentInstance?.onCollisionEnter,
      });

      // Props
      const stableProps = useRef(props);
      // Apply props to the instance
      useEffect(() => {
        if (!currentInstance) return;

        // Save original handlers
        const originalHandlers = {
          onCollisionEnter: currentInstance.onCollisionEnter,
        };
        originalHandlersRef.current = originalHandlers;

        if (stableProps) {
          Object.assign(currentInstance, stableProps);
        }

        // Restore handlers
        if (originalHandlers.onCollisionEnter) {
          currentInstance.onCollisionEnter = originalHandlers.onCollisionEnter;
        }
      }, []);

      // Update the entity periodically
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

      // Update the entity values from physics
      useFrame(() => {
        if (!currentInstance) return;
        const now = performance.now();
        if (now - lastUpdateTimeRef.current >= 5000) {
          // If the bodyRef or the visualRef is not defined, return (end loop)
          if (
            !bodyRef.current ||
            typeof bodyRef.current.translation !== "function" ||
            !visualRef.current
          )
            return;

          // Get bodyRef values
          const pos = bodyRef.current.translation();
          const rot = bodyRef.current.rotation();
          const scale = visualRef.current.scale;

          // Update pendingUpdate
          pendingUpdate.current = {
            ...currentInstance,
            position: new Vector3(pos.x, pos.y, pos.z),
            rotation: new Euler(rot.x, rot.y, rot.z),
            scale: [scale.x, scale.y, scale.z],
          };

          // Reset lastUpdateTime
          lastUpdateTimeRef.current = now;
        }
      });

      if (!currentInstance) return null;

      return (
        <RigidBody
          ref={bodyRef}
          onPointerDown={(e: PointerEvent) => {
            if (useEditTool) {
              e.stopPropagation();
              if (!bodyRef.current || !currentInstance || !visualRef.current)
                return;
              setSelectedEntity(currentInstance);
              setSelectedGroup(bodyRef.current);
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
      );
    },
  );

  WrappedEntityComponent.displayName = `EntityComponent(${EntityTemplate.name})`;

  return WrappedEntityComponent;
}
