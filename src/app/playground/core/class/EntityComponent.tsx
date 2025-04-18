import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useRef, useEffect } from "react";
import { Group, Vector3, Euler } from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import { EntityManager } from "./EntityManager";

export function EntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (
    currentInstance: T,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<Group | null>,
  ) => JSX.Element,
  useEditTool = true,
) {
  const WrappedEntityComponent = ({
    objectProps,
    ...props
  }: { objectProps?: T } & Partial<T>) => {
    // Refs
    const bodyRef = useRef<RapierRigidBody>(null);
    const visualRef = useRef<Group>(null);
    const pendingUpdate = useRef<T | null>(null);
    const lastUpdateTimeRef = useRef<number>(0);
    const initialized = useRef<boolean>(false);

    // Edit tool
    const {
      setPosition,
      setSelectedEntity,
      setSelectedGroup,
      setSelectedVisual,
    } = useEditToolStore();

    // Initialization
    const { updateEntity } = useEntityStore();

    // Get existing entity or create a new one
    const instanceRef = useRef<T | null>(null);
    

    if (!initialized.current) {
      const entityId = props.entityId || objectProps?.entityId;
      console.log(
        "Received entityId:",
        entityId,
        "| from props:",
        props.entityId,
        "| from objectProps:",
        objectProps?.entityId
      );
    }
    
    
    // Only run entity resolution logic once during component lifecycle
    if (!initialized.current) {
      // Try to find entity by ID first
      const entityId = props.entityId || objectProps?.entityId;
      
      if (entityId) {
        const existingEntity = EntityManager.getEntityById(entityId);
        if (existingEntity && existingEntity instanceof EntityClass) {
          instanceRef.current = existingEntity as T;
          console.log(`Reusing existing entity with ID: ${entityId}`);
        }
      }
      
      // If we still don't have an entity, use objectProps if provided
      if (!instanceRef.current && objectProps) {
        instanceRef.current = objectProps;
      }
      
      // If we still don't have an entity, create a new one
      if (!instanceRef.current) {
        instanceRef.current = new EntityClass();
        console.log(`Created new ${EntityClass.name} entity`);
      }
      
      // Ensure the entity has an ID
      if (!instanceRef.current.entityId) {
        EntityManager.generateIdToEntity(instanceRef.current);
        console.log(`Generated ID for entity: ${instanceRef.current.entityId}`);
      }
      
      // Add to entity manager if not already there
      if (!EntityManager.getEntityById(instanceRef.current.entityId)) {
        EntityManager.addEntity(instanceRef.current);
        console.log(`Added entity to EntityManager: ${instanceRef.current.entityId}`);
      }

      initialized.current = true;
    }

    const currentInstance = instanceRef.current;
    
    // Save original event handlers before overriding
    const originalHandlersRef = useRef({
      onCollisionEnter: currentInstance?.onCollisionEnter,
    });

    // Apply props to the instance
    useEffect(() => {
      if (!currentInstance) return;
      
      // Save original handlers
      const originalHandlers = {
        onCollisionEnter: currentInstance.onCollisionEnter,
      };
      originalHandlersRef.current = originalHandlers;
      
      // Apply props
      if (objectProps) {
        Object.assign(currentInstance, objectProps);
      }
      
      if (props) {
        Object.assign(currentInstance, props);
      }
      
      // Restore handlers
      if (originalHandlers.onCollisionEnter) {
        currentInstance.onCollisionEnter = originalHandlers.onCollisionEnter;
      }
    }, [objectProps, props]);

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
          {RenderMesh(currentInstance, bodyRef, visualRef)}
        </group>
      </RigidBody>
    );
  };

  WrappedEntityComponent.displayName = `EntityComponent(${EntityClass.name})`;

  return WrappedEntityComponent;
}