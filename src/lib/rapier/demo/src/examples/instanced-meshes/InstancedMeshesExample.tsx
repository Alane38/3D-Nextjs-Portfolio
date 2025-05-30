import {
    InstancedRigidBodies,
    InstancedRigidBodyProps,
    RapierRigidBody,
} from "@react-three/rapier";
import { button, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Color, InstancedMesh } from "three";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";
import { useSuzanne } from "../all-shapes/AllShapesExample";

const MAX_COUNT = 2000;

const createBody = (): InstancedRigidBodyProps => ({
  key: Math.random(),
  position: [Math.random() * 20, Math.random() * 20, Math.random() * 20],
  rotation: [
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
  ],
  scale: [0.5 + Math.random(), 0.5 + Math.random(), 0.5 + Math.random()],
});

export const InstancedMeshes = () => {
  const {
    nodes: { Suzanne },
  } = useSuzanne();

  useResetOrbitControls(30);

  const api = useRef<RapierRigidBody[]>([]);

  const [bodies, setBodies] = useState<InstancedRigidBodyProps[]>(() =>
    Array.from({
      length: 100,
    }).map(() => createBody()),
  );

  const ref = useRef<InstancedMesh>(null);

  useEffect(() => {
    if (ref.current) {
      for (let i = 0; i < MAX_COUNT; i++) {
        ref.current!.setColorAt(i, new Color(Math.random() * 0xffffff));
      }
      ref.current!.instanceColor!.needsUpdate = true;
    }
  }, []);

  const addMesh = () => {
    if (bodies.length < MAX_COUNT) {
      setBodies((bodies) => [...bodies, createBody()]);
    }
  };

  const removeMesh = () => {
    console.log("removeMesh", bodies.length);

    if (bodies.length > 0) {
      setBodies((bodies) => bodies.slice(0, bodies.length - 1));
    }
  };

  useControls(
    {
      "add instanced mesh": button(addMesh),
      "remove instanced mesh": button(removeMesh),
    },
    [bodies],
  );

  return (
    <group>
      <InstancedRigidBodies instances={bodies} ref={api} colliders="hull">
        <instancedMesh
          ref={ref}
          castShadow
          args={[Suzanne.geometry, undefined, MAX_COUNT]}
          count={bodies.length}
          onClick={(evt) => {
            api.current![evt.instanceId!].applyTorqueImpulse(
              {
                x: 0,
                y: 50,
                z: 0,
              },
              true,
            );
          }}
        >
          <meshPhysicalMaterial />
        </instancedMesh>
      </InstancedRigidBodies>
    </group>
  );
};
