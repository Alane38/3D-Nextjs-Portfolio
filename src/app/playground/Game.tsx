"use client";

import { Loading } from "@/components/Loading";
import { useLoadingAssets } from "@/hooks";
import { useIsMobile } from "@/hooks/useIsMobile";
import { KeyboardControls } from "@react-three/drei";
import { useEffect, useState } from "react";
import { globalControls } from "src/constants/default";
import { PerformanceWarning } from "../../components/PerformanceWarning";
import { useEntityStore } from "./core/class/entity.store";
import ToolBar from "./core/client/tool-bar/ToolBar";
import { Eva } from "./core/extension/eva/Eva";
import { PlacementManager } from "./core/PlacementManager";
import { GameCanvas } from "./GameCanvas";
import { FileWorld } from "./world/FileWorld";

export function Game() {
  const isMobile = useIsMobile();
  const loading = useLoadingAssets();
  const [visible, setVisible] = useState(true);
  const [minimumTimePassed, setMinimumTimePassed] = useState(false);

  const setEntities = useEntityStore((state) => state.setEntities);

  // Load entities from a file
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

  // Minimum time before closing the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumTimePassed(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  // Close the loading screen when progress is 100 and the minimum time has passed
  useEffect(() => {
    if (loading === 100 && minimumTimePassed) {
      setVisible(false);
    }
  }, [loading, minimumTimePassed]);

  if (isMobile)
    return (
      <div className="flex h-screen w-screen items-center justify-center text-center text-4xl text-red-500 px-8">
        Mobile not supported please use a computer to play
      </div>
    );

  return (
    <>
      {visible && (
        <Loading
          progress={loading}
          onSkip={() => {
            setVisible(false);
          }}
        />
      )}
      {/* Utils */}
      <PerformanceWarning />
      <ToolBar />
      <Eva collapsed={true} />
      {/* Games */}
      <KeyboardControls map={globalControls}>
        <GameCanvas>
          {/* <MainWorld /> */}
          <FileWorld />  
        </GameCanvas>
      </KeyboardControls>
    </>
  );
}
