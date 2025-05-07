import { DynamicRayCastVehicleController } from "@dimforge/rapier3d-compat";
import {
  RapierRigidBody,
  useAfterPhysicsStep,
  useRapier,
} from "@react-three/rapier";
import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const up = new THREE.Vector3(0, 1, 0);

const _wheelSteeringQuat = new THREE.Quaternion();
const _wheelRotationQuat = new THREE.Quaternion();

export type WheelInfo = {
  axleCs: THREE.Vector3;
  suspensionRestLength: number;
  suspensionStiffness: number;
  maxSuspensionTravel: number;
  position: THREE.Vector3;
  radius: number;
};

export const useVehicleController = (
  chassisRef: RefObject<RapierRigidBody>,
  wheelsRef: RefObject<THREE.Object3D[]>,
  wheelsInfo: WheelInfo[],
) => {
  const { world } = useRapier();

  const vehicleController = useRef<DynamicRayCastVehicleController | null>(null);

  // Store frame data safely
  const wheelStates = useRef(
    wheelsInfo.map(() => ({
      positionY: 0,
      rotation: new THREE.Quaternion(),
    })),
  );

  useEffect(() => {
    const { current: chassis } = chassisRef;
    const { current: wheels } = wheelsRef;

    if (!chassis || !wheels) return;

    const vehicle = world.createVehicleController(chassis);

    const suspensionDirection = new THREE.Vector3(0, -1, 0);

    wheelsInfo.forEach((wheel) => {
      vehicle.addWheel(
        wheel.position,
        suspensionDirection,
        wheel.axleCs,
        wheel.suspensionRestLength,
        wheel.radius,
      );
    });

    wheelsInfo.forEach((wheel, index) => {
      vehicle.setWheelSuspensionStiffness(index, wheel.suspensionStiffness);
      vehicle.setWheelMaxSuspensionTravel(index, wheel.maxSuspensionTravel);
    });

    vehicleController.current = vehicle;

    return () => {
      vehicleController.current = null;
      world.removeVehicleController(vehicle);
    };
  }, []);

  // Safely update wheel physics data
  useAfterPhysicsStep((world) => {
    const controller = vehicleController.current;
    if (!controller) return;

    controller.updateVehicle(world.timestep);

    wheelStates.current.forEach((state, index) => {
      const wheelAxleCs = controller.wheelAxleCs(index)!;
      const connection = controller.wheelChassisConnectionPointCs(index)?.y || 0;
      const suspension = controller.wheelSuspensionLength(index) || 0;
      const steering = controller.wheelSteering(index) || 0;
      const rotationRad = controller.wheelRotation(index) || 0;

      state.positionY = connection - suspension;

      _wheelSteeringQuat.setFromAxisAngle(up, steering);
      _wheelRotationQuat.setFromAxisAngle(wheelAxleCs, rotationRad);
      state.rotation.multiplyQuaternions(
        _wheelSteeringQuat,
        _wheelRotationQuat,
      );
    });
  });

  // Apply visual transforms *after* physics safely, in the render loop
  useFrame(() => {
    const wheels = wheelsRef.current;
    if (!wheels) return;

    wheels.forEach((wheel, index) => {
      const state = wheelStates.current[index];
      wheel.position.y = state.positionY;
      wheel.quaternion.copy(state.rotation);
    });
  });

  return {
    vehicleController,
  };
};
