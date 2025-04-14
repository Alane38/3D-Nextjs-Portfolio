import { useFrame } from "@react-three/fiber";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useEffect, useRef } from "react";
import * as THREE from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useEntityStore } from "./entity.store";
import EntityManager from "./EntityManager";

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
    const entityManager = EntityManager.getInstance();

    // Create instance -> extends EntityManager
    const instance = useRef<T>(entityManager.createEntity(EntityClass) as T);

    const object = instance.current;
    Object.assign(object, props);

    // DEBUG logs
    // const allEntityByName = entityManager.getAllByName(object.name);
    // const allEntity = entityManager.getAll();
    // console.log("EntityComponent by Name", object.name, allEntityByName);
    // console.log("ALL EntityComponent", object.name, allEntity);

    // console.log("EntityComponent", object.name);

    // Update instance (make it reactive to get current datas for example the position)
    useEffect(() => {
      if (model && instance.current) {
        Object.assign(instance.current, model);
      }
    }, [model]);

    const bodyRef = useRef<RapierRigidBody>(null);
    const visualRef = useRef<THREE.Group>(null);
    const pendingUpdate = useRef<T | null>(null);

    const {
      setPosition,
      setSelectedEntity,
      setSelectedGroup,
      setSelectedVisual,
    } = useEditToolStore();

    const lastUpdateTimeRef = useRef<number>(0);

    const { updateEntity } = useEntityStore();

    useEffect(() => {
      const id = setInterval(() => {
        // console.log(
        //   "UPDATE ENTITY ------ VERIFY INTERVAL",
        //   pendingUpdate.current,
        // );
        if (pendingUpdate.current) {
          updateEntity((e) => {
            if (e.entityId === object.entityId && pendingUpdate.current) {
              // console.log(
              //   "UPDATE ENTITY ------ VERIFY ID",
              //   e.entityId,
              //   object.entityId,
              // );
              e.position = pendingUpdate.current.position;
              e.rotation = pendingUpdate.current.rotation;
              e.scale = pendingUpdate.current.scale;
            }
            return e;
          });

          // console.log("UPDATE ENTITY ------ VERIFY RESULT", entities);

          pendingUpdate.current = null;
        }
      }, 5000); // Can adjust frequency

      return () => clearInterval(id);
    }, []);

    // Update entity values
    useFrame(() => {
      const now = performance.now();
      if (now - lastUpdateTimeRef.current >= 5000) {
        if (!bodyRef.current || !visualRef.current) return;
        
          const pos = bodyRef.current.translation();
          const rot = bodyRef.current.rotation();
          const scale = visualRef.current.scale;

          pendingUpdate.current = {
            ...object,
            position: new THREE.Vector3(pos.x, pos.y, pos.z),
            rotation: new THREE.Euler(rot.x, rot.y, rot.z),
            scale: [scale.x, scale.y, scale.z],
          };
        lastUpdateTimeRef.current = now;
      }
    });

    return (
      <>
        {/* Create the global entity */}
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
          {visualRef ? (
            <group ref={visualRef}>
              {RenderMesh(object, bodyRef, visualRef)}
            </group>
          ) : (
            RenderMesh(object, bodyRef)
          )}
        </RigidBody>
      </>
    );
  };
}
