import { createRef, useEffect, useState } from "react";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyOptions,
} from "@react-three/rapier";
import { ModelRenderer } from "@core/ModelRenderer";
import { useControls } from "leva";
import { generateUUID } from "three/src/math/MathUtils.js";
import { useFrame } from "@react-three/fiber";

export class Diamond {
  path: string;
  position: [number, number, number];
  mass: number;
  type: RigidBodyOptions["type"];
  colliders: RigidBodyOptions["colliders"];
  scale: number;
  ref: React.RefObject<RapierRigidBody | null>;

  constructor(
    path: string = "/diamond.glb",
    position: [number, number, number] = [0, 8, 0],
    mass: number = 1,
    type: RigidBodyOptions["type"] = "dynamic",
    colliders: RigidBodyOptions["colliders"] = "trimesh",
    scale: number = 1,
  ) {
    this.ref = createRef<RapierRigidBody | null>();
    this.path = path;
    this.position = position;
    this.mass = mass;
    this.type = type;
    this.colliders = colliders;
    this.scale = scale;
  }

  handlePointerDown() {
    if (this.ref.current) {
      this.ref.current.applyImpulse({ x: 0, y: 1000, z: 100 }, false);
      this.ref.current.applyTorqueImpulse({ x: 0, y: 1000, z: 100 }, false);
    }
  }

  getComponent() {
    const [controlScale, setControlScale] = useState(this.scale);
    const [controlPosition, setControlPosition] = useState(this.position);
    const [controlMass, setControlMass] = useState(this.mass);

    const controls = useControls(`Diamond`, {
      position: {
        value: this.position,
        onChange: (value) => setControlPosition(value),
        step: 0.1,
      },
      mass: {
        value: this.mass,
        onChange: (value) => setControlMass(value),
        min: 0.1,
        max: 10,
        step: 0.1,
      },
      scale: {
        value: this.scale,
        onChange: (value) => setControlScale(value),
        min: 0.1,
        max: 5,
        step: 0.1,
      },
    });

    const hash = generateUUID();

    useEffect(() => {
      console.log("POS", this.position);
    }, [this.position]);

    useEffect(() => {
      this.scale = controlScale;
    }, [controlScale]);

    useEffect(() => {
      this.mass = controlMass;
    }, [controlMass]);

    useFrame(() => {
      if (this.ref.current) {
        const newPos = this.ref.current.translation();
        this.position = [newPos.x, newPos.y, newPos.z];
        console.log("Position en temps réel :", this.position);
      }
    });

    return (
      <RigidBody
        key={hash}
        type={this.type}
        colliders={this.colliders}
        mass={controlMass}
        scale={controlScale}
        position={controlPosition}
        ref={this.ref}
      >
        <group onPointerDown={() => this.handlePointerDown()}>
          <ModelRenderer path={this.path} />
        </group>
      </RigidBody>
    );
  }
}
