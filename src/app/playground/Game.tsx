"use client";

import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";
import { useEffect, useState } from "react";
import { globalControls } from "src/constants/default";
import { PerformanceWarning } from "../../components/PerformanceWarning";

import { Loading } from "@/components/Loading";
import { useLoadingAssets } from "@/hooks";
import { useEntityStore } from "./core/class/entity.store";
import Inventory from "./core/client/inventory/Inventory";
import { ENTITY_TYPES, PlacementManager } from "./core/PlacementManager";
import { GameCanvas } from "./GameCanvas";
import { FileWorld } from "./world/FileWorld";

export function Game() {
  const [visible, setVisible] = useState(true);
  const loading = useLoadingAssets();

  // Store initial entities
  const { entities, setEntities } = useEntityStore();

  // Load the world, and load the entities.
  useEffect(() => {
    const loadFromFile = async () => {
      try {
        const data = PlacementManager.load(
          await fetch("/save.json").then((r) => r.text()),
        );

        console.log(
          "Chargement par défaut (fichier chargé)",
          data.map((e) => e.name),
        );
        setEntities(data);
      } catch (e) {
        console.warn("Chargement par défaut (aucun fichier trouvé)", e);

        // ENTITY_TYPES
        // Set all entity types
        Object.values(ENTITY_TYPES).forEach((EntityClass) => {
          const entity = new EntityClass();
          entity.position.set(
            entity.position.x,
            entity.position.y,
            entity.position.z,
          );
          entity.rotation.set(
            entity.rotation.x,
            entity.rotation.y,
            entity.rotation.z,
          );
          entity.scale = entity.scale;
          entity.type = entity.type;
          entity.path = entity.name;
          entities.push(entity);
        });

        setEntities(entities);
      }
    };

    loadFromFile();
  }, []);

  return (
    <>
      {loading !== 100 && visible && (
        <Loading
          progress={loading}
          onSkip={() => {
            setVisible(false);
          }}
        />
      )}
      <PerformanceWarning />
      <Leva collapsed={true} /> {/* Leva Panel Settings */}
      {/* Player Inventory */}
      <Inventory />
      {/* Controls */}
      <KeyboardControls map={globalControls}>
        <GameCanvas>
          {/* Put the world scene here */}
          {/* <MainWorld /> */}
          <FileWorld />
          {/* <TestWorld /> */}
          {/* <JumpGame /> */}
        </GameCanvas>
      </KeyboardControls>
    </>
  );
}
