import { RapierRigidBody, RigidBody } from "@react-three/rapier";
import { JSX, useRef } from "react";
import * as THREE from "three";
import { useEditToolStore } from "../client/inventory/edit-tool/store/useEditTool.store";
import { Entity } from "./Entity";

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
    const instance = useRef<T>(new EntityClass());

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
        {...object}
      >
        { visualRef ? <group ref={visualRef}>{RenderMesh(object, bodyRef, visualRef)}</group> : RenderMesh(object, bodyRef)}
      </RigidBody>
    );
  };
}
