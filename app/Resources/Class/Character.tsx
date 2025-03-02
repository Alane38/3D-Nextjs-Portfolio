import { createRef, useEffect } from "react";
import { RapierContext, RigidBody, RigidBodyOptions, useRapier } from "@react-three/rapier";
import { ModelRenderer } from "@/app/Core/ModelRenderer";
import { EntityProps } from "@/types/EntityProps";
import { KeyboardControls, KeyboardControlsProps, useKeyboardControls } from "@react-three/drei";

interface CharacterState {
  rapier: RapierContext;
  keyboardControls: KeyboardControlsProps;
}

export class Character {
    EntityProps: EntityProps;
    CharacterState: CharacterState;
     ref: React.RefObject<any>;

  constructor(
    position: [number, number, number] = [4, 1, 0],
    mass: number = 1,
    type: RigidBodyOptions["type"] = "dynamic",
    colliders: RigidBodyOptions["colliders"] = "trimesh",
    scale: number = 1,
    rapier: RapierContext,
    keyboardControls: KeyboardControlsProps,
  ) {
    this.ref = createRef();

    this.EntityProps = {
      position,
      mass,
      type,
      colliders,
      scale,
    };
    this.CharacterState = {
      rapier,
      keyboardControls,
    };
    }


  getComponent() {
    const { position, mass, type, colliders, scale } = this.EntityProps;
    return (
      <RigidBody
        type={type}
        colliders={colliders}
        mass={mass}
        scale={scale}
        position={position}
        ref={this.ref}
      >
        <mesh ref={this.ref} position={position} scale={scale}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    );
  }
}


interface ControlsProps {
  onRapierReady: (rapier: RapierContext) => void;
  onKeyboardControlsReady: (controls: any) => void;
}

const Controls: React.FC<ControlsProps> = ({ onRapierReady, onKeyboardControlsReady }) => {
  useEffect(() => {
    const rapier = useRapier();
    const [, getKeyboardControls] = useKeyboardControls();
    onRapierReady(rapier);
    onKeyboardControlsReady(getKeyboardControls);
  }, [onRapierReady, onKeyboardControlsReady]);
    
  return null; 
};

export default Controls;