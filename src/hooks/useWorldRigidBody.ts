import { RapierRigidBody, useRapier } from "@react-three/rapier";
import { RefObject } from "react";

export const useWorldRigidBody = (ref: RefObject<RapierRigidBody | null>) => {
    const { world } = useRapier();
    if (!ref.current) return null;
    const rigidbody = world.getRigidBody(ref.current?.handle);
    return rigidbody;
}