import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useEffect, useRef } from "react";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import { Euler, Group, Vector3 } from "three";
import { EntityManager } from "./EntityManager";

/**
 *
 * @param EntityClass - the class of the entity
 * @param RenderMesh - render the 3D model
 * @param useEditTool - default true, can use edit tool(move, rotate, scale...)
 * @returns
 */
export function EntityComponent<T extends Entity>(
  EntityClass: new () => T,
  RenderMesh: (
    currentInstance: T,
    rigidBodyRef: React.RefObject<RapierRigidBody | null>,
    visualRef?: React.RefObject<Group | null>,
  ) => JSX.Element,
  useEditTool = true,
) {
  /**
   *
   * @param objectProps - the props of the entity
   * @param props - the props of the entity
   * @returns
   */
  const WrappedEntityComponent = ({
    objectProps,
    ...props
  }: { objectProps?: T } & Partial<T>) => {
    /** Create a instance of the global Entity */
    // Get existing entity, add to the entitiesMap if it doesn't includes it.
    const existingEntityById = props.entityId
      ? (EntityManager.getEntityById(props.entityId) as T)
      : undefined;

    const existingEntityByName = EntityManager.getEntityByName(
      EntityClass.name,
    ) as T | undefined;

    const instanceEntity =
      objectProps ?? existingEntityById ?? existingEntityByName;

    if (
      instanceEntity &&
      !EntityManager.getAllEntities().includes(instanceEntity)
    ) {
      EntityManager.addEntity(instanceEntity);
    }

    // Create a instance of the entity, if it doesn't exist. If it exist, use the existing instance.
    /**
          {
        "rigidBodyRef": {
            "current": null
        },
        "name": "Diamond",
        "entityId": "Diamond3",
        "path": "/assets/3d/glb/Diamond.glb",
        "position": {
            "x": 10,
            "y": 2,
            "z": 10
        },
        "rotation": {
            "isEuler": true,
            "_x": 0,
            "_y": 0,
            "_z": 0,
            "_order": "XYZ"
        },
        "args": [
            1,
            1,
            1
        ],
        "mass": 1,
        "type": "dynamic",
        "colliders": "hull",
        "scale": 1,
        "ccd": false,
        "canSleep": true,
        "lockTranslations": true,
        "lockRotations": false,
        "enabledRotations": [
            true,
            true,
            true
        ],
        "springed": false
    }
    */
    const instance = useRef<T>(
      instanceEntity ?? EntityManager.createEntity(EntityClass),
    );

    const currentInstance = instance.current;

    console.log(currentInstance, "currentInstance");

    console.log("all entities", EntityManager.getAllEntities());

    // Loaded Entity via JSON(Serialized Entity) -> {entity.renderComponent()}
    // - props
    /**
     { }
     */

    // - objectProps
    /**
          {
        "rigidBodyRef": {
            "current": null
        },
        "name": "Diamond",
        "entityId": "Entity0.7571396098054197",
        "path": "/assets/3d/glb/Diamond.glb",
        "position": {
            "x": 0,
            "y": 1.5,
            "z": 0
        },
        "rotation": {
            "isEuler": true,
            "_x": 4.0764618347566284e-8,
            "_y": 3.9408387664252587e-8,
            "_z": -5.4033439056411225e-8,
            "_order": "XYZ"
        },
        "args": [
            1,
            1,
            1
        ],
        "mass": 1,
        "type": "fixed",
        "colliders": "hull",
        "scale": [
            1,
            1,
            1
        ],
        "ccd": false,
        "canSleep": true,
        "lockTranslations": true,
        "lockRotations": false,
        "enabledRotations": [
            true,
            true,
            true
        ],
        "springed": false
    }
     */

    // World Entity -> <EntityComponent />
    // - props
    /**
        {
        "position": {
            "x": 10,
            "y": 2,
            "z": 10
        },
        "entityId": "Diamond3"
    }
     */

    // - objectProps
    /**
     * undefined
     */

    // Save all events handlers
    const originalHandlers = {
      onCollisionEnter: currentInstance?.onCollisionEnter,
    };

    if (currentInstance) {
      // Merge props
      Object.assign(currentInstance, props, objectProps);
    }

    /**
            {
        "rigidBodyRef": {
            "current": null
        },
        "name": "Diamond",
        "entityId": "Diamond3",
        "path": "/assets/3d/glb/Diamond.glb",
        "position": {
            "x": 10,
            "y": 2,
            "z": 10
        },
        "rotation": {
            "isEuler": true,
            "_x": 0,
            "_y": 0,
            "_z": 0,
            "_order": "XYZ"
        },
        "args": [
            1,
            1,
            1
        ],
        "mass": 1,
        "type": "dynamic",
        "colliders": "hull",
        "scale": 1,
        "ccd": false,
        "canSleep": true,
        "lockTranslations": true,
        "lockRotations": false,
        "enabledRotations": [
            true,
            true,
            true
        ],
        "springed": false
    }
         */

    // Assign handlers back
    if (currentInstance) {
      currentInstance.onCollisionEnter = originalHandlers.onCollisionEnter;
    }

    // Update instance (make it reactive to get current datas for example the position)
    useEffect(() => {
      if (!currentInstance) return;
      if (objectProps) {
        Object.assign(currentInstance, objectProps);
      }
    }, [objectProps]);

    // Refs
    const bodyRef = useRef<RapierRigidBody>(null);
    const visualRef = useRef<Group>(null);
    const pendingUpdate = useRef<T | null>(null);
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

    // Update the entity
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

    // Update the entity values
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
