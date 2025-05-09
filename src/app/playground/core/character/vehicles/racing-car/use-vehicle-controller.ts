import { DynamicRayCastVehicleController } from "@dimforge/rapier3d-compat";
import { RapierRigidBody, useAfterPhysicsStep, useRapier } from "@react-three/rapier";
import { RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const up = new THREE.Vector3(0, 1, 0);

// Create quaternions outside of render loop for reuse
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

type WheelState = {
  positionY: number;
  rotation: THREE.Quaternion;
};

export const useVehicleController = (
  chassisRef: RefObject<RapierRigidBody>,
  wheelsRef: RefObject<THREE.Object3D[]>,
  wheelsInfo: WheelInfo[],
) => {
  const { world } = useRapier();
  
  // Store vehicle controller reference
  const vehicleController = useRef<DynamicRayCastVehicleController | null>(null);

  // Store wheel state data safely outside of the physics loop
  const wheelStates = useRef<WheelState[]>(
    wheelsInfo.map(() => ({
      positionY: 0,
      rotation: new THREE.Quaternion(),
    }))
  );

  // Initialize vehicle controller once
  useEffect(() => {
    const { current: chassis } = chassisRef;
    const { current: wheels } = wheelsRef;

    if (!chassis || !wheels) return;

    // Safety check to prevent multiple controllers
    if (vehicleController.current) {
      try {
        world.removeVehicleController(vehicleController.current);
      } catch (e) {
        console.warn("Error removing previous vehicle controller:", e);
      }
      vehicleController.current = null;
    }

    try {
      // Create new vehicle controller
      const vehicle = world.createVehicleController(chassis);
      
      const suspensionDirection = new THREE.Vector3(0, -1, 0);

      // Add wheels with safe error handling
      wheelsInfo.forEach((wheel, index) => {
        try {
          vehicle.addWheel(
            wheel.position,
            suspensionDirection,
            wheel.axleCs,
            wheel.suspensionRestLength,
            wheel.radius,
          );
          
          vehicle.setWheelSuspensionStiffness(index, wheel.suspensionStiffness);
          vehicle.setWheelMaxSuspensionTravel(index, wheel.maxSuspensionTravel);
        } catch (e) {
          console.warn(`Error setting up wheel ${index}:`, e);
        }
      });

      vehicleController.current = vehicle;
    } catch (e) {
      console.error("Error creating vehicle controller:", e);
    }

    // Cleanup function
    return () => {
      if (vehicleController.current) {
        try {
          world.removeVehicleController(vehicleController.current);
          vehicleController.current = null;
        } catch (e) {
          console.warn("Error during cleanup:", e);
        }
      }
    };
  }, [world]);

  // Safely update wheel physics data after physics step
  useAfterPhysicsStep(() => {
    const controller = vehicleController.current;
    if (!controller) return;
    
    try {
      // Update vehicle - using a try/catch to handle potential errors
      controller.updateVehicle(world.timestep);
      
      // Update wheel states safely
      wheelStates.current.forEach((state, index) => {
        try {
          const wheelAxleCs = controller.wheelAxleCs(index);
          if (!wheelAxleCs) return;
          
          const connection = controller.wheelChassisConnectionPointCs(index)?.y || 0;
          const suspension = controller.wheelSuspensionLength(index) || 0;
          const steering = controller.wheelSteering(index) || 0;
          const rotationRad = controller.wheelRotation(index) || 0;

          state.positionY = connection - suspension;

          // Create a new quaternion each time to avoid reference issues
          _wheelSteeringQuat.setFromAxisAngle(up, steering);
          _wheelRotationQuat.setFromAxisAngle(wheelAxleCs, rotationRad);
          
          // Apply rotations to the state quaternion
          state.rotation.copy(_wheelSteeringQuat).multiply(_wheelRotationQuat);
        } catch (e) {
          console.warn(`Error updating wheel ${index} state:`, e);
        }
      });
    } catch (e) {
      console.error("Error in vehicle physics update:", e);
    }
  });

  // Apply visual transforms in the render loop
  useFrame(() => {
    const wheels = wheelsRef.current;
    if (!wheels) return;

    wheels.forEach((wheel, index) => {
      if (!wheel) return;
      
      try {
        const state = wheelStates.current[index];
        
        // Apply position and rotation to wheel meshes
        wheel.position.y = state.positionY;
        wheel.quaternion.copy(state.rotation);
      } catch (e) {
        console.warn(`Error updating wheel ${index} visuals:`, e);
      }
    });
  });

  return {
    vehicleController,
  };
};