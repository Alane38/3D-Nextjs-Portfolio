"use client";

import { KeyboardControls } from "@react-three/drei";
import { Leva } from "leva";
import { useEffect } from "react";
import { globalControls } from "src/constants/default";
import { PerformanceWarning } from "../../components/PerformanceWarning";
import { useEntityStore } from "./core/class/entity.store";
import Inventory from "./core/client/inventory/Inventory";
import { PlacementManager } from "./core/PlacementManager";
import { GameCanvas } from "./GameCanvas";
import { FileWorld } from "./world/FileWorld";

export function Game() {

  // Store initial entities
  const {setEntities } = useEntityStore();

  // Load the world, and load the entities.
  useEffect(() => {
    const loadFromFile = async () => {
      try {
        const data = PlacementManager.load(
          await fetch("/save.json").then((r) => r.text()),
        );

        console.log(
          "Chargement par défaut (fichier chargé)",
          data.map((e) => e.entityName),
        );
        setEntities(data);
      } catch {
        console.warn("Chargement par défaut (aucun fichier trouvé)");
      }
    };

    loadFromFile();
  }, []);

  return (
    <>
      {/* {loading !== 100 && visible && (
        <Loading
          progress={loading}
          onSkip={() => {
            setVisible(false);
          }}
        />
      )} */}
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
