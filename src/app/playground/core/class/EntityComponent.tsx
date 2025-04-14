import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useRef } from "react";
import * as THREE from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";
import { useFrame } from "@react-three/fiber";
import { useEntityStore } from "./entity.store";

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
    // Create instance
    const instance = useRef<T>(new EntityClass());

    // Fusion of props and model
    const object = instance.current;
    Object.assign(object, props);

    console.log("EntityComponent", object.name);
    // console.log(EntitySingleton.getAllInstances());

    // const singletonUpdatedInstance = EntitySingleton.getInstanceByName<T>(object.name);
    // // Delete instance if EntitySingleton is removed
    // if (singletonUpdatedInstance) {
    //   console.log("EntityComponent", object.name, "removed");
    //   return;
    // }

    // console.log("EntityComponent", object.name);

    //TODO: TO CONSOLE.LOG
    // useEffect(() => {
    //   if (model) {
    //     Object.assign(instance.current, model);
    //   }
    // }, [model]);

    // useEffect(() => {
    //   if (model) {
    //     instance.current = model;
    //   }
    // }, [model]);

    const bodyRef = useRef<RapierRigidBody>(null);
    const visualRef = useRef<THREE.Group>(null);

    const { setPosition, setSelectedGroup, setSelectedVisual } =
      useEditToolStore();

    const lastUpdateTimeRef = useRef<number>(0);

    const { entities, setEntities } = useEntityStore((state) => state);

    // Update entity values
    useFrame(() => {
      const now = performance.now();
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = now;
        return;
      }

      const delta = now - lastUpdateTimeRef.current;

      if (delta >= 10000) {
        if (bodyRef.current && visualRef.current) { // For each registered entities(PlacementManager) :
          // Get all values
          const pos = bodyRef.current.translation();
          const rot = bodyRef.current.rotation();
          const scale = visualRef.current.scale;
          object.position = new THREE.Vector3(pos.x, pos.y, pos.z);
          object.rotation = new THREE.Euler(rot.x, rot.y, rot.z);
          object.scale = [scale.x, scale.y, scale.z];

          // Save it in the store(use to save the world)
          setEntities(
            entities.map((e) => (e.name === object.name ? object : e)),
          );
        }

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
