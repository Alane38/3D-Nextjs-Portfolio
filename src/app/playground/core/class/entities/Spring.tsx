import { useForwardedRef } from "@/lib/rapier/react-three-rapier/src/hooks/use-forwarded-ref";
import { vectorArrayToVector3 } from "@/lib/rapier/react-three-rapier/src/utils/utils";
import {
  BallCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyOptions,
  useSpringJoint,
} from "@react-three/rapier";
import { forwardRef, useRef } from "react";
import { Vector3 } from "three";

interface BallSpringProps extends RigidBodyOptions {
  jointNum: number;
  total: number;
}

/**
 * Renders the 3D model.
 *
 * @component
 * @param {BallSpring} props - Props
 * @param {BallSpring} floorRef - Reference to the floor
 * @returns {JSX.Element}
 */
export const BallSpring = forwardRef<RapierRigidBody, BallSpringProps>(
  (props, floorRef) => {
    const floor = useForwardedRef(floorRef);
    const ball = useRef<RapierRigidBody>(null!);

    const stiffness = 1.0e3;
    const criticalDamping = 2.0 * Math.sqrt(stiffness * (props.mass ?? 1));
    const dampingRatio = props.jointNum / (props.total / 2);
    const damping = dampingRatio * criticalDamping;

    const ballPos = props.position as Vector3;

    if (!ballPos) {
      throw new Error("BallSpring requires a position prop");
    }

    useSpringJoint(ball, floor, [
      [0, 0, 0],
      [ballPos.x, ballPos.y - 3, ballPos.z],
      0,
      stiffness,
      damping,
    ]);

    return (
      <RigidBody
        key={`spring-${props.jointNum}`}
        {...props}
        ref={ball}
        ccd
        name={`spring-${props.jointNum}`}
        position={ballPos}
        colliders={false}
        canSleep={false}
      >
        {/* <Sphere args={[0.5]} castShadow receiveShadow>
          <meshStandardMaterial color="#E09F3E" />
        </Sphere> */}
        <BallCollider args={[0.5]} />
      </RigidBody>
    );
  }
);

BallSpring.displayName = "BallSpring";

/**
 *
 * @component
 * @returns {JSX.Element}
 */
export const SpringExample = () => {
  const floor = useRef<RapierRigidBody>(null);

  return (
    <>
      <group>
        <BallSpring
          ref={floor}
          position={vectorArrayToVector3([0, 5, 0])}
          mass={1}
          jointNum={0}
          total={30}
        />
      </group>
    </>
  );
};
