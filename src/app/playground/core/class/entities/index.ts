import { Entity } from "../Entity";

import { KinematicMovingPlatformEntity } from "./platform/dynamic/KineticMovingPlatform";
import { FPPushtoMove } from "./platform/floating/FPPushtoMove";
import { Diamond, DiamondComponent } from "./Diamond";
import { KillBrick, KillBrickComponent } from "./KillBrick";
import { NeonDoor, NeonDoorComponent } from "./NeonDoor";
import { RestaurantSign, RestaurantSignComponent } from "./RestaurantSign";
import { Spinner, SpinnerComponent } from "./Spinner";
import { TextObject, TextObjectComponent } from "./TextObject";

const entityClasses = [
  KinematicMovingPlatformEntity,
  FPPushtoMove,
  Diamond,
  KillBrick,
  NeonDoor,
  RestaurantSign,
  Spinner,
  TextObject,
];

export const allEntities: Entity[] = entityClasses
  .map((EntityClass) => new EntityClass())
  .filter((e): e is Entity => !!e.entityName);

export {
  KinematicMovingPlatformEntity,
  FPPushtoMove,
  Diamond,
  DiamondComponent,
  KillBrick,
  KillBrickComponent,
  NeonDoor,
  NeonDoorComponent,
  RestaurantSign,
  RestaurantSignComponent,
  Spinner,
  SpinnerComponent,
  TextObject,
  TextObjectComponent,
};
