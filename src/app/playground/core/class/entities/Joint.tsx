import { Box, Sphere } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyTypeString,
  usePrismaticJoint,
  useSphericalJoint,
} from "@react-three/rapier";
import {
  createRef,
  forwardRef,
  ReactNode,
  RefObject,
  useRef
} from "react";
import { Mesh } from "three";
import { Entity } from "../Entity";
import { EntityComponent } from "../EntityComponent";

// === ENTITY: Rope ===
export class Rope extends Entity {
  constructor(public length = 40) {
    super("Rope");
    this.type = "dynamic";
    this.colliders = false;
  }

  renderComponent() {
    return <RopeComponent objectProps={this} />;
  }
}

// === ENTITY: PrismaticJointDemo ===
export class PrismaticJointDemo extends Entity {
  constructor() {
    super("PrismaticJointDemo");
    this.type = "dynamic";
  }

  renderComponent() {
    return <PrismaticExampleComponent model={this} />;
  }
}

// === COMPONENTS ===

const ShadowElement = forwardRef<Mesh>((_, ref) => (
  
  <Sphere castShadow ref={ref} args={[0.5]}>
    <meshPhysicalMaterial />
  </Sphere>
));

ShadowElement.displayName = "ShadowElement";

type RopeSegmentProps = {
  position: [number, number, number];
  component: ReactNode;
  type: RigidBodyTypeString;
};

const RopeSegment = forwardRef<RapierRigidBody, RopeSegmentProps>(
  ({ position, component, type }, ref) => (
    <RigidBody ref={ref} type={type} position={position}>
      {component}
    </RigidBody>
  ),
);

RopeSegment.displayName = "RopeSegment";

const RopeJoint = ({
  a,
  b,
}: {
  a: RefObject<RapierRigidBody>;
  b: RefObject<RapierRigidBody>;
}) => {
  useSphericalJoint(a, b, [
    [-0.5, 0, 0],
    [0.5, 0, 0],
  ]);
  return null;
};

const RopeComponent = EntityComponent(Rope, (object, rigidBodyRef) => {
  
  const refs = useRef(
    Array.from({ length: object.length }).map(() =>
      createRef<RapierRigidBody>(),
    ) as RefObject<RapierRigidBody>[],
  );

  return (
    <group>
      {refs.current.map((ref, i) => (
        <RopeSegment
          key={i}
          ref={ref}
          position={[i * 1, 0, 0]}
          component={<ShadowElement />}
          type={i === 0 ? "kinematicPosition" : "dynamic"}
        />
      ))}
      {refs.current.map(
        (ref, i) =>
          i > 0 && (
            <RopeJoint a={refs.current[i]} b={refs.current[i - 1]} key={i} />
          ),
      )}
    </group>
  );
});

const PrismaticExampleComponent = ({
  model,
}: {
  model?: PrismaticJointDemo;
}) => {
  const box1 = useRef<RapierRigidBody>(null!);
  const box2 = useRef<RapierRigidBody>(null!);

  usePrismaticJoint(box1, box2, [
    [-4, 0, 0],
    [0, 4, 0],
    [1, 0, 0],
    [-2, 2],
  ]);

  return (
    <group position={[0, 3, 0]}>
      <RigidBody ref={box1}>
        <Box scale={[2, 2, 2]} />
      </RigidBody>
      <RigidBody ref={box2} type="fixed">
        <Box scale={[2, 2, 2]} />
      </RigidBody>
    </group>
  );
};

// === ENTRY POINT COMPOSANT ===

export const Joints = () => {
  return (
    <group>
      <RopeComponent />
      <PrismaticExampleComponent />
    </group>
  );
};
