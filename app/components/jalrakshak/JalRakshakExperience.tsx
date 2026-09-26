"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import InspectionControls, { type CameraMode } from "./InspectionControls";
import JalRakshakHUD from "./JalRakshakHUD";
import JalRakshakScene from "./JalRakshakScene";
import styles from "../../jalrakshak/jalrakshak.module.css";
import type { RoverPart } from "./RoverParts";

export default function JalRakshakExperience() {
  const [cameraMode, setCameraMode] = useState<CameraMode>("overview");
  const [detectionActive, setDetectionActive] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredRoverPart, setHoveredRoverPart] = useState<RoverPart | null>(null);
  const [selectedRoverPart, setSelectedRoverPart] = useState<RoverPart | null>(null);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches);
    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    const introTimer = window.setTimeout(() => setIntroVisible(false), motionPreference.matches ? 3200 : 5200);
    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
      window.clearTimeout(introTimer);
    };
  }, []);

  const inspectDetection = () => {
    setHoveredRoverPart(null);
    setDetectionActive(true);
    setCameraMode("detection");
  };

  const changeCameraMode = (mode: CameraMode) => {
    setHoveredRoverPart(null);
    setCameraMode(mode);
  };

  return (
    <main className={styles.experience} data-detection-active={detectionActive} aria-label="JalRakshak underground pipeline inspection simulation">
      <div className={styles.canvasFrame}>
        <Canvas
          camera={{ position: [11.5, 4.5, -22], fov: 58, near: 0.1, far: 140 }}
          dpr={[1, 1.35]}
          shadows="basic"
          fallback={<div className={styles.webglFallback} role="status">3D preview unavailable. This concept is a browser-based simulation.</div>}
        >
          <color attach="background" args={["#10191b"]} />
          <fog attach="fog" args={["#10252a", 26, 142]} />
          <ambientLight intensity={0.78} />
          <hemisphereLight args={["#a9c1c0", "#12191a", 0.82]} />
          <directionalLight position={[8, 6, -32]} intensity={2.15} color="#e6dfc9" castShadow />
          <pointLight position={[0, 3.2, -12]} intensity={14} distance={13} color="#9cc2c4" />
          <pointLight position={[0, 3.2, -37]} intensity={13} distance={13} color="#8fb8bd" />
          <pointLight position={[0, 3.2, -63]} intensity={11} distance={13} color="#82aeb5" />
          <pointLight position={[1.3, -1.25, -46]} intensity={18} distance={12} color="#b7d2c8" />
          <pointLight position={[5.1, -1.8, -50]} intensity={7} distance={5} color="#92c0c5" />
          <JalRakshakScene cameraMode={cameraMode} detectionActive={detectionActive} reducedMotion={reducedMotion} hoveredRoverPart={hoveredRoverPart} selectedRoverPart={selectedRoverPart} onHoverRoverPart={setHoveredRoverPart} onSelectRoverPart={setSelectedRoverPart} onSelectDetection={inspectDetection} />
        </Canvas>
      </div>
      <div className={styles.sceneVignette} aria-hidden="true" />
      <JalRakshakHUD cameraMode={cameraMode} detectionActive={detectionActive} introVisible={introVisible} selectedRoverPart={selectedRoverPart} onSelectRoverPart={setSelectedRoverPart} />
      <InspectionControls cameraMode={cameraMode} onChangeMode={changeCameraMode} onSelectDetection={inspectDetection} />
    </main>
  );
}