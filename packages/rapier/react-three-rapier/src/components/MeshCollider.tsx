import { memo, ReactNode, useMemo, useRef } from "react";
import { Object3D } from "three";
import { AnyCollider } from "..";
import { useChildColliderProps, useRapier } from "../hooks/hooks";
import { RigidBodyAutoCollider } from "../types";
import { useRigidBodyContext } from "./RigidBody";

export interface MeshColliderProps {
  children: ReactNode;
  type: RigidBodyAutoCollider;
}

/**
 * A mesh collider is a collider that is automatically generated from the geometry of the children.
 * @constantsategory Colliders
 */
export const MeshCollider = memo((props: MeshColliderProps) => {
  const { children, type } = props;
  const { physicsOptions } = useRapier();
  const object = useRef<Object3D>(null);
  const { options } = useRigidBodyContext();

  const mergedOptions = useMemo(() => {
    return {
      ...physicsOptions,
      ...options,
      children: undefined,
      colliders: type,
    };
  }, [physicsOptions, options]);

  const childColliderProps = useChildColliderProps(
    object,
    mergedOptions,
    false,
  );

  return (
    <object3D
      ref={object}
      userData={{
        r3RapierType: "MeshCollider",
      }}
    >
      {children}
      {childColliderProps.map((colliderProps, index) => (
        <AnyCollider key={index} {...colliderProps} />
      ))}
    </object3D>
  );
});

MeshCollider.displayName = "MeshCollider";
