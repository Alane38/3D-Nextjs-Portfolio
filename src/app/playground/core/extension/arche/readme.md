# ARCHE : Advanced Rapier Character Handling Engine

1. Easy to implement
2. Managing travel modes
3. Managing camera modes
4. Implementing the CharacterModel and its animations using only ArcheAnimation
5. Slope management
6. The character can stand still on a mobile platform
7. PointerLock for better movements
8. Can be used on mobiles
9. AutoFlip feature; allows the character to turn around automatically
10. AutoBalance feature; character balancing management
11. FloatMode feature; the character can levitate
12. BunLint Friendly
13. Customizable RigidBody for humans or quadrupeds
14. Customizable characters actions
15. TypeScript Friendly

## New Features

### (2024-6-24) FixedCamera Mode:

- The "OnlyCamera" mode automatically rotates the camera as the character turns. You can activate it with the following code:

`<Arche mode="OnlyCamera">`

![screenshot](public/assets/images/example/controlcamera.png)

## Project Link

Live Demo: Unavailable

## Local Setup

(IN PROGRESS)

```js
import Arche from "arche";
import { ArcheAnimation } from "ArcheAnimation";
```

To get started, set up your keyboard map using [KeyboardControls](https://github.com/pmndrs/drei#keyboardcontrols). Finally, wrap your canvas with.

```js
/**
 * Keyboards Controls Setup: Keys are declared in a constant folder at the root of the project(/constants/default.ts).
 */

// Default.ts

export const globalControls = [
  { name: "forward", keys: ["ArrowUp", "z", "Z"] },
  { name: "back", keys: ["ArrowDown", "s", "S"] },
  { name: "left", keys: ["ArrowLeft", "q", "Q"] },
  { name: "right", keys: ["ArrowRight", "d", "D"] },
  { name: "run", keys: ["ShiftLeft"] },
  { name: "jump", keys: ["Space", " "] },
  { name: "reset", keys: ["KeyR", "r"] },
];

// Game.tsx(or App.tsx), we setup the keyboard controls here, above your canvas.

<KeyboardControls map={globalControls}>
  <GameCanvas>{/* Your 3D World */}</GameCanvas>
</KeyboardControls>;

// Character.tsx

return (
  <>
    ...
    {/* Character Control */}
    <Arche>
      <ArcheAnimation />
    </Arche>
  </>
);
```

Here are all the default properties you can play with for `<Ecctrl>`:

```js
// Default properties for Arche
ArcheProps: {
     // TypeScript interface for ARCHE component
    children,

    defaultPlayer = false,
    // Colliders settings
    hitboxHeight = 0.5,
    hitboxWidth = 0.3,
    hitboxLenght = 0.1,
    hitboxRadius = 0.3,

    floatMode = false,
    floatHeight = 0,

    // Character initial setup
    characterInitDir = 0, // Rad

    // Control I/O
    enableControl = false,

    // Camera I/O
    enableFollowCam = false,
    enableFollowCamPos = null,
    enableFollowCamTarget = null,

    // Follow camera settings
    // Camera distance/limit
    camInitDis = -5,
    camMaxDis = -7,
    camMinDis = -0.7,
    camUpLimit = 1.5, // Rad
    camLowLimit = -1.3, // Rad
    // Camera direction
    camInitDir = { x: 0, y: 0 }, // Rad
    // Camera target a position ?
    camTargetPos = { x: 0, y: 0, z: 0 },
    // Camera speed
    camMoveSpeed = 1,
    camZoomSpeed = 1,
    // Camera collision
    camCollision = true,
    camCollisionOffset = 0.7,
    camCollisionSpeedMult = 4,
    // Camera control rotation
    controlCamRotMult = 2,
    // Follow light settings
    // Follow Light I/O
    followLight = false,
    // Follow light position
    followLightPos = { x: 20, y: 30, z: 10 },

    // Controls settings
    maxVelLim = 2.5,
    // Turn vel/speed
    turnVelMultiplier = 0.1,
    turnSpeed = 4,
    // Sprint
    sprintMult = 2,
    // Jump
    jumpVel = 8,
    jumpForceToGroundMult = 5,
    slopJumpMult = 0.25,
    sprintJumpMult = 1.1,
    // Air drag
    airDragMultiplier = 0.2,
    dragDampingC = 0.15,
    // acceleration --
    accDeltaTime = 8,
    rejectVelMult = 4,
    moveImpulsePointY = 0.5,
    // Camera controls
    camFollowMult = 11,
    camLerpMult = 25,
    // Falling
    fallingGravityScale = 3,
    fallingMaxVel = -20,
    //Flipped
    autoFlip = true,
    flipAngle = 0.75,
    // Wake up
    wakeUpDelay = 100,
    // Floating Ray setups
    rayOriginOffest = { x: 0, y: -hitboxWidth, z: 0 },
    rayHitForgiveness = 0.1,
    rayLength = hitboxHeight,
    rayDir = { x: 0, y: -1, z: 0 },
    floatingDis = hitboxHeight + floatHeight,
    springK = 1.2,
    dampingC = 0.08,
    // Slope Ray setups
    showSlopeRayOrigin = false,
    slopeMaxAngle = 1, // in rad
    slopeRayOriginOffest = hitboxHeight - 0.03,
    slopeRayLength = hitboxHeight + 2,
    slopeRayDir = { x: 0, y: -1, z: 0 },
    slopeUpExtraForce = 0.05,
    slopeDownExtraForce = 0.2,
    // AutoBalance Force setups
    autoBalance = true,
    autoBalanceSpringK = 0.5,
    autoBalanceDampingC = 0.2,
    autoBalanceSpringOnY = 0.1,
    autoBalanceDampingOnY = 0.01,
    // Animation I/O
    animated = false,
    // Mode setups
    camMode = null,
    camListenerTarget = "domElement",
    // Controller setups
    controllerKeys = {
      forward: 12,
      back: 13,
      left: 14,
      right: 15,
      jump: 2,
      action1: 11,
      action2: 3,
      action3: 1,
      action4: 0,
    },
    // Point-to-move setups
    bodySensorSize = [hitboxHeight / 2, hitboxWidth],
    bodySensorPosition = { x: 0, y: 0, z: hitboxWidth / 2 },
    // Other rigibody props from parent

    // custom props
    infiniteJump = false,

    ...props
}

// Simply change the value by doing this
<Arche maxVelLimit={5} jumpVel={4} position={[0,10,0]}>
</Arche>
```

### Apply Character Animations

You can apply character animations by using `<ArcheAnimation>`, it manages your character's 3d model and its animations via the animation set.

```js
// Prepare character model url
const characterURL = "./ReplaceWithYourCharacterURL";

// Prepare and rename your character animations here
// Note: idle, walk, run, jump, jumpIdle, jumpLand and fall names are essential
// Missing any of these names might result in an error: "cannot read properties of undifined (reading 'reset')"
const animationSet = {
  idle: animationPrefix + "idle",
  walk: animationPrefix + "walk",
  run: animationPrefix + "run",
  jump: animationPrefix + "jump",
  jumpIdle: animationPrefix + "jumpIdle",
  jumpLand: animationPrefix + "jumpLand",
};

return (
  <>
    ...
    {/* Character Control */}
    <Arche animated>
      {/* Character Animations */}
      <ArcheAnimation
        path={characterPath + path} // Must have property
        animationSet={animationSet}
        rigidBodyProps={{
          scale: 0.013,
          position: [0, -0.7, 0],
        }}
      />
    </Arche>
  </>
);
```

### (Advanced) Add and Personalize Additional Animations

For advanced animation setups, download all files and follow these steps:

1. In `Character.tsx`, expand the `animationSet` with additional animations:

```js
const animationSet = {
  idle: animationPrefix + "idle",
  walk: animationPrefix + "walk",
  run: animationPrefix + "run",
  jump: animationPrefix + "jump",
  jumpIdle: animationPrefix + "jumpIdle",
  jumpLand: animationPrefix + "jumpLand",
  action1: animationPrefix + "action1",
  ...
};

```

2. In `useGame.tsx`, create a trigger function for the new animation:

```js
    {
      /**
       * Character animations state manegement
       */
      // Initial animation
      moveToPoint: new THREE.Vector3(),
      curAnimation: "",
      animationSet: {} as AnimationSet,

      ...

       action1: () =>
      get().setAnimation(
        get().animationSet.action1 || "",
        get().curAnimation === get().animationSet.idle,
      ),
    }
```

3. In `Arche.tsx`, initialize the trigger function and call it when needed:

```js
// Character animations
// Initialization
const idle = useGame((state) => state.idle);
const walk = useGame((state) => state.walk);
const run = useGame((state) => state.run);
const jump = useGame((state) => state.jump);
const jumpIdle = useGame((state) => state.jumpIdle);
const fall = useGame((state) => state.fall);
const action1 = useGame((state) => state.action1);
const action2 = useGame((state) => state.action2);
const action3 = useGame((state) => state.action3);
const action4 = useGame((state) => state.action4);

// Animation
const idleAnimation = animated ? idle : null;
const walkAnimation = animated ? walk : null;
const runAnimation = animated ? run : null;
const jumpAnimation = animated ? jump : null;
const jumpIdleAnimation = animated ? jumpIdle : null;
const fallAnimation = animated ? fall : null;
const action1Animation = animated ? action1 : null;
const action2Animation = animated ? action2 : null;
const action3Animation = animated ? action3 : null;
const action4Animation = animated ? action4 : null;
```

(Prevents an error or a function is called in a conditional statement)

### ArcheJoystick and Touch buttons

To get start, simply import `ArcheJoystick` from `arche`
(This part is unchanged from Ecctrl's original code)

```js
import { ArcheJoystick } from "arche";
```

Place `<ArcheJoystick>` outside of your canvas component, and you're done!

```js
//...
  <ArcheJoystick />
  <Canvas>
    {/* ... */}
  </Canvas>
//...
```

You can also add lights or additional meshs like so (note: this will create components twice, once inside the joystick's scene, another inside the buttons' scene, so keep an eye on performance):

```js
//...
  <ArcheJoystick>
    <ambientLight />
    <mesh>
      <boxGeometry args={[1,1,1]} />
    </mesh>
  </ArcheJoystick>
  <Canvas>
    {/* ... */}
  </Canvas>
//...
```

Additionally, you can change components' material, geometry, or texture as you like:

```js
//...
  <ArcheJoystick
    joystickBaseProps={{
      receiveShadow: true,
      material: new THREE.MeshStandardMaterial({ color: "grey" })
    }}
  />
  <Canvas>
    {/* ... */}
  </Canvas>
//...
```

Here are all the properties you can play with for `<ArcheJoystick>`:

```js
ArcheJoystickProps: {
    // Joystick props
    children?: ReactNode;
    joystickRunSensitivity?: number; // Sensitivity for transitioning to the running state. The default value is 0.9 (valid range: 0 < joystickRunSensitivity < 1)
    joystickPositionLeft?: number; // joystick div container position left
    joystickPositionBottom?: number; // joystick div container position bottom
    joystickHeightAndWidth?: number; // joystick div container height and width
    joystickCamZoom?: number; // camera zoom level for the joystick
    joystickCamPosition?: [x: number, y: number, z: number]; // camera position for the joystick
    joystickBaseProps?: ThreeElements['mesh']; // custom properties for the joystick's base mesh
    joystickStickProps?: ThreeElements['mesh']; // custom properties for the joystick's stick mesh
    joystickHandleProps?: ThreeElements['mesh']; // custom properties for the joystick's handle mesh

    // Touch buttons props
    buttonNumber?: number; // Number of buttons (max 5)
    buttonPositionRight?: number; // buttons div container position right
    buttonPositionBottom?: number; // buttons div container position bottom
    buttonHeightAndWidth?: number; // buttons div container height and width
    buttonCamZoom?: number; // camera zoom level for the buttons
    buttonCamPosition?: [x: number, y: number, z: number]; // camera position for the buttons
    buttonGroup1Position?: [x: number, y: number, z: number]; // button 1 posiiton in 3D scene
    buttonGroup2Position?: [x: number, y: number, z: number]; // button 2 posiiton in 3D scene
    buttonGroup3Position?: [x: number, y: number, z: number]; // button 3 posiiton in 3D scene
    buttonGroup4Position?: [x: number, y: number, z: number]; // button 4 posiiton in 3D scene
    buttonGroup5Position?: [x: number, y: number, z: number]; // button 5 posiiton in 3D scene
    buttonLargeBaseProps?: ThreeElements['mesh']; // custom properties for the buttons' large base mesh
    buttonSmallBaseProps?: ThreeElements['mesh']; // custom properties for the buttons' small base mesh
    buttonTop1Props?: ThreeElements['mesh']; // custom properties for the button 1 top mesh (large button)
    buttonTop2Props?: ThreeElements['mesh']; // custom properties for the button 2 top mesh (large button)
    buttonTop3Props?: ThreeElements['mesh']; // custom properties for the button 3 top mesh (small button)
    buttonTop4Props?: ThreeElements['mesh']; // custom properties for the button 4 top mesh (small button)
    buttonTop5Props?: ThreeElements['mesh']; // custom properties for the button 5 top mesh (small button)
};
```

### Using your own joystick or buttons

If you prefer to use your custom joystick or buttons, you can leverage the `useJoystickControls` hook from `arche`. Import the hook and call the appropriate functions::

```js
import { useJoystickControls } from "arche";
//...
const setJoystick = useJoystickControls((state) => state.setJoystick);
const resetJoystick = useJoystickControls((state) => state.resetJoystick);
const pressButton1 = useJoystickControls((state) => state.pressButton1);
const releaseAllButtons = useJoystickControls(
  (state) => state.releaseAllButtons,
);
//...
// call the proper fuctions
setJoystick(joystickDis, joystickAng, runState);
// or
pressButton1();
```

### Arche Controller Mode

Activate different modes in Arche by using the `camMode` property. For example, to activate the "ControlCamera" mode, you can use :
`<Arche camMode="ControlCamera">`.

#### 1. "PointToMove" Mode

This mode doesn't require keyboard controls and is designed for click-to-move or path-following features.

```js
import { useGame } from "ecctrl";
// ...
const setMoveToPoint = useGame((state) => state.setMoveToPoint);
// ...
// call function setMoveToPoint(), whenever character needs to move
setMoveToPoint(point); // "point" is a vec3 value
```

#### 2. ControlCamera Mode

This mode requires keyboard controls to control character; you can use WASD/ZQSD or arrow keys to move and space to jump.
The camera automaticaly follows the character. But you can control the camera with mouse, and also lock the mouse to totally control camera without click.

```js
import { useGame } from "arche";
// ...
    const isModeControlCamera = modeSet.has("ControlCamera");

  <Arche
  camMode="ControlCamera"
        characterInitDir={0}
        camInitDis={-3.5}
        camMaxDis={-5}
        camMinDis={-1.5}
        camUpLimit={1.2}
        camLowLimit={-1}
        camInitDir={{ x: 0, y: 0 }}
        camTargetPos={{ x: 0, y: 0.5, z: 0 }}
        camMoveSpeed={1.5}
        camZoomSpeed={1.2}
        camCollision={true}
        camCollisionOffset={0.5}
        camCollisionSpeedMult={5}
        controlCamRotMult={2}
        camListenerTarget="domElement"
        camFollowMult={10}
        camLerpMult={20}
  >
```

#### 3. OnlyCamera Mode

This mode requires keyboard controls to control character; you can use W/Z to move and change direction based on camera movement.

```js
import { useGame } from "arche";
// ...
  const isModeOnlyCamera = modeSet.has("OnlyCamera");

  <Arche
  camMode="OnlyCamera"
        characterInitDir={0}
        camInitDis={-3.5}
        camMaxDis={-5}
        camMinDis={-1.5}
        camUpLimit={1.2}
        camLowLimit={-1}
        camInitDir={{ x: 0, y: 0 }}
        camTargetPos={{ x: 0, y: 0.5, z: 0 }}
        camMoveSpeed={1.5}
        camZoomSpeed={1.2}
        camCollision={true}
        camCollisionOffset={0.5}
        camCollisionSpeedMult={5}
        controlCamRotMult={2}
        camListenerTarget="domElement"
        camFollowMult={10}
        camLerpMult={20}
  >
```

### (Optional) First-person view setup

If you want to use a first-person view, you can set the `mode` prop to `"OnlyCamera"` in the `<Arche>` component.

```js
<Arche
  camCollision={false} // disable camera collision detect (useless in FP mode)
  camInitDis={-0.01} // camera intial position
  camMinDis={-0.01} // camera zoom in closest position
  camFollowMult={1000} // give a big number here, so the camera follows the target (character) instantly
  camLerpMult={1000} // give a big number here, so the camera lerp to the followCam position instantly
  turnVelMultiplier={1} // Turning speed same as moving speed
  turnSpeed={100} // give it big turning speed to prevent turning wait time
  mode="OnlyCamera" // character's rotation will follow camera's rotation in this mode
>
```

## Contributions

Thanks to Erdong Chen for his invaluable contributions to this project.

Thank you!
