import { camListenerTargetType } from "../Galaad";

export type UseFollowCameraProps = {
  disableFollowCam?: boolean;
  disableFollowCamPos?: { x: number; y: number; z: number } | null;
  disableFollowCamTarget?: { x: number; y: number; z: number } | null;
  camInitDis?: number;
  camMaxDis?: number;
  camMinDis?: number;
  camUpLimit?: number;
  camLowLimit?: number;
  camInitDir?: { x: number; y: number };
  camMoveSpeed?: number;
  camZoomSpeed?: number;
  camCollisionOffset?: number;
  camCollisionSpeedMult?: number;
  camListenerTarget?: camListenerTargetType;
};
