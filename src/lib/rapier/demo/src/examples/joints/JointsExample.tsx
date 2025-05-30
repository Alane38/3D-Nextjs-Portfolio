import { Box, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
    RapierRigidBody,
    RigidBody,
    RigidBodyTypeString,
    usePrismaticJoint,
    useSphericalJoint,
    Vector3Tuple,
} from "@react-three/rapier";
import { createRef, forwardRef, ReactNode, RefObject, useRef } from "react";
import { Mesh, Quaternion } from "three";
import { useResetOrbitControls } from "../../hooks/use-reset-orbit-controls";

const ShadowElement = forwardRef<Mesh>((_, ref) => (
  <Sphere castShadow ref={ref} args={[0.5]}>
    <meshPhysicalMaterial />
  </Sphere>
));

type RopeSegmentProps = {
  position: Vector3Tuple;
  component: ReactNode;
  type: RigidBodyTypeString;
};

const RopeSegment = forwardRef<RapierRigidBody, RopeSegmentProps>(
  ({ position, component, type }, ref) => {
    return (
      <RigidBody ref={ref} type={type} position={position}>
        {component}
      </RigidBody>
    );
  },
);

const RopeJoint = ({
  a,
  b,
}: {
  a: RefObject<RapierRigidBody>;
  b: RefObject<RapierRigidBody>;
}) => {
  const joint = useSphericalJoint(a, b, [
    [-0.5, 0, 0],
    [0.5, 0, 0],
  ]);

  return null;
};

const Rope = (props: { component: ReactNode; length: number }) => {
  const refs = useRef(
    Array.from({ length: props.length }).map(() =>
      createRef<RapierRigidBody>(),
    ) as RefObject<RapierRigidBody>[],
  );

  useFrame(() => {
    const now = performance.now();
    refs.current[0].current!.setNextKinematicRotation(
      new Quaternion(0, Math.sin(now / 500) * 3, 0),
    );
  });

  return (
    <group>
      {refs.current.map((ref, i) => (
        <RopeSegment
          ref={ref}
          key={i}
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
};

const PrismaticExample = () => {
  const box1 = useRef<RapierRigidBody>(null!);
  const box2 = useRef<RapierRigidBody>(null!);
  const joint = usePrismaticJoint(box1, box2, [
    [-4, 0, 0],
    [0, 4, 0],
    [1, 0, 0],
    [-2, 2],
  ]);

  return (
    <group>
      <RigidBody ref={box1}>
        <Box />
      </RigidBody>
      <RigidBody ref={box2}>
        <Box />
      </RigidBody>
    </group>
  );
};

export const Joints = () => {
  useResetOrbitControls();

  return (
    <group>
      <Rope length={40} component={<ShadowElement />} />

      <PrismaticExample />
    </group>
  );
};
