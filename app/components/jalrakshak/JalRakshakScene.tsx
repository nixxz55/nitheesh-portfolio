"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import InspectionRobot from "./InspectionRobot";
import LeakZone from "./LeakZone";
import type { CameraMode } from "./InspectionControls";
import Pipeline from "./Pipeline";
import WaterVolume from "./WaterVolume";
import type { RoverPart } from "./RoverParts";

const cameraViews: Record<CameraMode, Record<"landscape" | "portrait", { position: THREE.Vector3; target: THREE.Vector3 }>> = {
  overview: {
    landscape: { position: new THREE.Vector3(11.5, 4.5, -22), target: new THREE.Vector3(1.2, -2, -50) },
    portrait: { position: new THREE.Vector3(12, 4.2, -17), target: new THREE.Vector3(1.2, -2.3, -50) },
  },
  robot: {
    landscape: { position: new THREE.Vector3(0.2, -1.4, -41), target: new THREE.Vector3(1.5, -2.75, -48) },
    portrait: { position: new THREE.Vector3(0.4, -1.1, -40.5), target: new THREE.Vector3(1.4, -2.75, -48) },
  },
  detection: {
    landscape: { position: new THREE.Vector3(10, 0.3, -42), target: new THREE.Vector3(3.91, -2, -50) },
    portrait: { position: new THREE.Vector3(10.5, 0.8, -41), target: new THREE.Vector3(3.91, -2, -50) },
  },
  roverSystem: {
    landscape: { position: new THREE.Vector3(1.7, -1.15, -39.5), target: new THREE.Vector3(1.3, -2.75, -48) },
    portrait: { position: new THREE.Vector3(0.4, -0.9, -40.5), target: new THREE.Vector3(1.3, -2.75, -48) },
  },
};

function InspectionCamera({ cameraMode, reducedMotion }: { cameraMode: CameraMode; reducedMotion: boolean }) {
  const target = useRef(new THREE.Vector3(1.2, -2, -50));
  const [orbitReady, setOrbitReady] = useState(false);
  const { size } = useThree();
  const view = cameraViews[cameraMode][size.width < size.height ? "portrait" : "landscape"];

  useFrame(({ camera }, delta) => {
    if (cameraMode === "roverSystem" && orbitReady) return;
    const blend = reducedMotion ? 1 : 1 - Math.exp(-2.1 * Math.min(delta, 0.06));
    camera.position.lerp(view.position, blend);
    target.current.lerp(view.target, blend);
    camera.lookAt(target.current);
    if (cameraMode === "roverSystem" && !orbitReady && camera.position.distanceTo(view.position) < 0.025 && target.current.distanceTo(view.target) < 0.025) setOrbitReady(true);
  });

  return <OrbitControls
    enabled={cameraMode === "roverSystem" && orbitReady}
    enableDamping={!reducedMotion}
    enablePan={false}
    minDistance={6.5}
    maxDistance={9.5}
    minPolarAngle={0.72}
    maxPolarAngle={2.22}
    minAzimuthAngle={-0.8}
    maxAzimuthAngle={0.8}
    target={view.target.toArray()}
  />;
}

export default function JalRakshakScene({ cameraMode, detectionActive, reducedMotion, hoveredRoverPart, selectedRoverPart, onHoverRoverPart, onSelectRoverPart, onSelectDetection }: { cameraMode: CameraMode; detectionActive: boolean; reducedMotion: boolean; hoveredRoverPart: RoverPart | null; selectedRoverPart: RoverPart | null; onHoverRoverPart: (part: RoverPart | null) => void; onSelectRoverPart: (part: RoverPart) => void; onSelectDetection: () => void }) {
  return (
    <>
      <InspectionCamera key={cameraMode} cameraMode={cameraMode} reducedMotion={reducedMotion} />
      <Pipeline />
      <WaterVolume reducedMotion={reducedMotion} />
      <InspectionRobot detectionActive={detectionActive} reducedMotion={reducedMotion} inspectionMode={cameraMode === "roverSystem"} hoveredPart={hoveredRoverPart} selectedPart={selectedRoverPart} onHoverPart={onHoverRoverPart} onSelectPart={onSelectRoverPart} />
      <LeakZone active={detectionActive} onSelect={onSelectDetection} reducedMotion={reducedMotion} />
    </>
  );
}