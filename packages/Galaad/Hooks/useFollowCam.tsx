import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useCallback } from "react";
import * as THREE from "three";
import { camListenerTargetType } from "../Galaad";
import { UseFollowCameraProps } from "../types/UseFollowCameraProps";

export const useFollowCam = ({
  disableFollowCam = false,
  disableFollowCamPos = null,
  disableFollowCamTarget = null,
  camInitDis = -5,
  camMaxDis = -7,
  camMinDis = -0.7,
  camUpLimit = 1.5,
  camLowLimit = -1.3,
  camInitDir = { x: 0, y: 0 },
  camMoveSpeed = 1,
  camZoomSpeed = 1,
  camCollisionOffset = 0.7,
  camCollisionSpeedMult = 4,
  camListenerTarget = "domElement",
}: UseFollowCameraProps = {}) => {
  const { scene, camera, gl } = useThree();
  const isMouseDown = useRef(false);
  const previousTouches = useRef<{ touch1?: Touch; touch2?: Touch }>({});

  const originZDis = useRef<number>(camInitDis);
  const pivot = useMemo(() => new THREE.Object3D(), []);
  const followCam = useMemo(() => {
    const origin = new THREE.Object3D();
    origin.position.set(
      0,
      originZDis.current * Math.sin(-camInitDir.x),
      originZDis.current * Math.cos(-camInitDir.x),
    );
    return origin;
  }, []);

  let smallestDistance = null;
  let cameraDistance = null;
  let intersects = null;

  const intersectObjects = useRef<THREE.Object3D[]>([]);
  const cameraRayDir = useMemo(() => new THREE.Vector3(), []);
  const cameraRayOrigin = useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const camLerpingPoint = useMemo(() => new THREE.Vector3(), []);
  const camRayCast = new THREE.Raycaster(
    cameraRayOrigin,
    cameraRayDir,
    0,
    -camMaxDis,
  );

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (document.pointerLockElement || isMouseDown.current) {
      pivot.rotation.y -= e.movementX * 0.002 * camMoveSpeed;
      const vy = followCam.rotation.x + e.movementY * 0.002 * camMoveSpeed;
      const cameraDistance = followCam.position.length();

      if (vy >= camLowLimit && vy <= camUpLimit) {
        followCam.rotation.x = vy;
        followCam.position.y = -cameraDistance * Math.sin(-vy);
        followCam.position.z = -cameraDistance * Math.cos(-vy);
      }
    }
  }, []);

  const onMouseWheel = useCallback((e: WheelEvent) => {
    const vz = originZDis.current - e.deltaY * 0.002 * camZoomSpeed;
    if (vz >= camMaxDis && vz <= camMinDis) {
      originZDis.current = vz;
      followCam.position.z =
        originZDis.current * Math.cos(-followCam.rotation.x);
      followCam.position.y =
        originZDis.current * Math.sin(-followCam.rotation.x);
    }
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const { touch1, touch2 } = previousTouches.current;
    const [currentTouch1, currentTouch2] = e.targetTouches;

    if (touch1 && !touch2 && currentTouch1) {
      pivot.rotation.y -=
        (currentTouch1.pageX - touch1.pageX) * 0.005 * camMoveSpeed;
      const vy =
        followCam.rotation.x +
        (currentTouch1.pageY - touch1.pageY) * 0.005 * camMoveSpeed;
      const cameraDistance = followCam.position.length();
      if (vy >= camLowLimit && vy <= camUpLimit) {
        followCam.rotation.x = vy;
        followCam.position.y = -cameraDistance * Math.sin(-vy);
        followCam.position.z = -cameraDistance * Math.cos(-vy);
      }
    }

    if (touch1 && touch2 && currentTouch1 && currentTouch2) {
      const prevDist = Math.hypot(
        touch1.pageX - touch2.pageX,
        touch1.pageY - touch2.pageY,
      );
      const newDist = Math.hypot(
        currentTouch1.pageX - currentTouch2.pageX,
        currentTouch1.pageY - currentTouch2.pageY,
      );
      const vz =
        originZDis.current - (prevDist - newDist) * 0.01 * camZoomSpeed;
      if (vz >= camMaxDis && vz <= camMinDis) {
        originZDis.current = vz;
        followCam.position.z =
          originZDis.current * Math.cos(-followCam.rotation.x);
        followCam.position.y =
          originZDis.current * Math.sin(-followCam.rotation.x);
      }
    }

    previousTouches.current = { touch1: currentTouch1, touch2: currentTouch2 };
  }, []);

  const joystickCamMove = (movementX: number, movementY: number) => {
    pivot.rotation.y -= movementX * 0.005 * camMoveSpeed * 5;
    const vy = followCam.rotation.x + movementY * 0.005 * camMoveSpeed * 5;

    cameraDistance = followCam.position.length();

    if (vy >= camLowLimit && vy <= camUpLimit) {
      followCam.rotation.x = vy;
      followCam.position.y = -cameraDistance * Math.sin(-vy);
      followCam.position.z = -cameraDistance * Math.cos(vy);
    }
  };

  const cameraCollisionDetect = (delta: number) => {
    // Update collision detect ray origin and pointing direction
    // Which is from pivot point to camera position
    cameraRayOrigin.copy(pivot.position);
    camera.getWorldPosition(cameraPosition);
    cameraRayDir.subVectors(cameraPosition, pivot.position);
    // rayLength = cameraRayDir.length();

    // casting ray hit, if object in between character and camera,
    // change the smallestDistance to the ray hit toi
    // otherwise the smallestDistance is same as camera original position (originZDis)
    intersects = camRayCast.intersectObjects(intersectObjects.current);
    if (intersects.length && intersects[0].distance <= -originZDis.current) {
      smallestDistance = Math.min(
        -intersects[0].distance * camCollisionOffset,
        camMinDis,
      );
    } else {
      smallestDistance = originZDis.current;
    }

    // Rapier ray hit setup (optional)
    // rayHit = world.castRay(rayCast, rayLength + 1, true, null, null, character);
    // if (rayHit && rayHit.toi && rayHit.toi > originZDis) {
    //   smallestDistance = -rayHit.toi + 0.5;
    // } else if (rayHit == null) {
    //   smallestDistance = originZDis;
    // }

    // Update camera next lerping position, and lerp the camera
    camLerpingPoint.set(
      followCam.position.x,
      smallestDistance * Math.sin(-followCam.rotation.x),
      smallestDistance * Math.cos(-followCam.rotation.x),
    );

    followCam.position.lerp(
      camLerpingPoint,
      1 - Math.exp(-camCollisionSpeedMult * delta),
    ); // delta * 2 for rapier ray setup
  };

  useEffect(() => {
    pivot.rotation.y = camInitDir.y;
    followCam.rotation.x = camInitDir.x;
    pivot.add(followCam);
    scene.add(pivot);

    const target =
      camListenerTarget === "domElement" ? gl.domElement : document;
    target.addEventListener("mousedown", () => (isMouseDown.current = true));
    target.addEventListener("mouseup", () => (isMouseDown.current = false));
    target.addEventListener("mousemove", onMouseMove as EventListener);
    target.addEventListener("wheel", onMouseWheel as EventListener);
    target.addEventListener("touchmove", onTouchMove as EventListener, {
      passive: false,
    });

    return () => {
      target.removeEventListener(
        "mousedown",
        () => (isMouseDown.current = true),
      );
      target.removeEventListener(
        "mouseup",
        () => (isMouseDown.current = false),
      );
      target.removeEventListener("mousemove", onMouseMove as EventListener);
      target.removeEventListener("wheel", onMouseWheel as EventListener);
      target.removeEventListener("touchmove", onTouchMove as EventListener);
      scene.remove(pivot);
    };
  }, []);

  return { pivot, followCam, cameraCollisionDetect, joystickCamMove };
};
