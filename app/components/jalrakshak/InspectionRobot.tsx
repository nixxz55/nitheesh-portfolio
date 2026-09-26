"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Html, Line } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import styles from "../../jalrakshak/jalrakshak.module.css";
import { roverParts } from "./RoverParts";
import type { RoverPart } from "./RoverParts";

type PartEventHandlers = {
  onPointerOver: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (event: ThreeEvent<PointerEvent>) => void;
  onClick: (event: ThreeEvent<PointerEvent>) => void;
};

function DriveWheel({ side, axle, highlighted, handlers }: { side: -1 | 1; axle: -1 | 1; highlighted: boolean; handlers: PartEventHandlers }) {
  return (
    <group onPointerOver={handlers.onPointerOver} onPointerOut={handlers.onPointerOut} onClick={handlers.onClick} position={[side * 0.75, -0.09, axle * 0.41]} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.34, 0.34, 0.2, 24]} />
        <meshStandardMaterial color="#242927" metalness={0.28} roughness={0.88} />
      </mesh>
      <mesh position={[0, -side * 0.11, 0]}>
        <cylinderGeometry args={[0.21, 0.21, 0.025, 20]} />
        <meshStandardMaterial color={highlighted ? "#e0b77e" : "#c0b9a7"} metalness={0.8} roughness={0.34} />
      </mesh>
      <mesh position={[0, -side * 0.128, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.03, 16]} />
        <meshStandardMaterial color="#555c56" metalness={0.82} roughness={0.33} />
      </mesh>
    </group>
  );
}

const partAnchors: Record<RoverPart, [number, number, number]> = {
  chassis: [0, 0.08, 0.02],
  drive: [0.86, -0.08, -0.4],
  camera: [0, 0.39, -0.83],
  sensor: [0.92, 0.34, -0.23],
  imu: [0, 0.47, 0.42],
  controller: [-0.32, 0.4, 0.16],
  battery: [0.34, 0.4, 0.16],
  communication: [0.48, 0.47, 0.46],
};

export default function InspectionRobot({ detectionActive, reducedMotion, inspectionMode, hoveredPart, selectedPart, onHoverPart, onSelectPart }: { detectionActive: boolean; reducedMotion: boolean; inspectionMode: boolean; hoveredPart: RoverPart | null; selectedPart: RoverPart | null; onHoverPart: (part: RoverPart | null) => void; onSelectPart: (part: RoverPart) => void }) {
  const platform = useRef<THREE.Group>(null);
  const bindPart = (part: RoverPart) => ({
    onPointerOver: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHoverPart(part); },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHoverPart(null); },
    onClick: (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onSelectPart(part); },
  });
  const isHighlighted = (part: RoverPart) => hoveredPart === part || selectedPart === part;
  const hoveredInfo = roverParts.find((part) => part.id === hoveredPart);
  const driveEvents = bindPart("drive");

  useFrame(({ clock }) => {
    if (!platform.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    platform.current.position.set(1.3 + Math.sin(time * 0.24) * 0.055, -2.75 + Math.sin(time * 0.7) * 0.018, -48 + Math.sin(time * 0.3) * 0.18);
    platform.current.rotation.y = reducedMotion ? 0 : Math.sin(time * 0.24) * 0.01;
  });

  return (
    <group ref={platform} position={[1.3, -2.75, -48]} scale={1.5}>
      <mesh {...bindPart("chassis")} position={[0, 0.02, 0]} castShadow>
        <boxGeometry args={[1.48, 0.42, 1.3]} />
        <meshStandardMaterial color="#b5b1a3" metalness={0.64} roughness={0.42} emissive={isHighlighted("chassis") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("chassis") ? 0.28 : 0} />
      </mesh>
      <mesh {...bindPart("chassis")} position={[0, 0.21, 0.02]} castShadow>
        <boxGeometry args={[0.94, 0.16, 0.82]} />
        <meshStandardMaterial color="#555b55" metalness={0.78} roughness={0.38} emissive={isHighlighted("chassis") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("chassis") ? 0.24 : 0} />
      </mesh>
      <mesh {...bindPart("chassis")} position={[0, 0.12, -0.59]}>
        <boxGeometry args={[0.68, 0.16, 0.12]} />
        <meshStandardMaterial color="#cd9255" metalness={0.66} roughness={0.42} />
      </mesh>

      <DriveWheel side={-1} axle={-1} highlighted={isHighlighted("drive")} handlers={driveEvents} />
      <DriveWheel side={-1} axle={1} highlighted={isHighlighted("drive")} handlers={driveEvents} />
      <DriveWheel side={1} axle={-1} highlighted={isHighlighted("drive")} handlers={driveEvents} />
      <DriveWheel side={1} axle={1} highlighted={isHighlighted("drive")} handlers={driveEvents} />
      <mesh position={[-0.62, -0.01, -0.3]} rotation={[-0.35, 0, 0.18]}><cylinderGeometry args={[0.055, 0.055, 0.48, 10]} /><meshStandardMaterial color="#686b63" metalness={0.74} roughness={0.4} /></mesh>
      <mesh position={[-0.62, -0.01, 0.3]} rotation={[0.35, 0, 0.18]}><cylinderGeometry args={[0.055, 0.055, 0.48, 10]} /><meshStandardMaterial color="#686b63" metalness={0.74} roughness={0.4} /></mesh>
      <mesh position={[0.62, -0.01, -0.3]} rotation={[-0.35, 0, -0.18]}><cylinderGeometry args={[0.055, 0.055, 0.48, 10]} /><meshStandardMaterial color="#686b63" metalness={0.74} roughness={0.4} /></mesh>
      <mesh position={[0.62, -0.01, 0.3]} rotation={[0.35, 0, -0.18]}><cylinderGeometry args={[0.055, 0.055, 0.48, 10]} /><meshStandardMaterial color="#686b63" metalness={0.74} roughness={0.4} /></mesh>

      <mesh {...bindPart("camera")} position={[0, 0.36, 0.08]}>
        <cylinderGeometry args={[0.24, 0.29, 0.19, 24]} />
        <meshStandardMaterial color="#464e49" metalness={0.78} roughness={0.38} />
      </mesh>
      <mesh {...bindPart("camera")} position={[0, 0.39, -0.74]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.14, 24]} />
        <meshStandardMaterial color="#171c1b" metalness={0.24} roughness={0.24} />
      </mesh>
      <mesh {...bindPart("camera")} position={[0, 0.39, -0.825]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.018, 24]} />
        <meshStandardMaterial color="#9ab0ae" metalness={0.32} roughness={0.19} emissive="#405a57" emissiveIntensity={0.24} />
      </mesh>
      <mesh {...bindPart("imu")} position={[0, 0.5, 0.37]}>
        <cylinderGeometry args={[0.12, 0.14, 0.14, 16]} />
        <meshStandardMaterial color="#88887c" metalness={0.8} roughness={0.38} />
      </mesh>
      <mesh {...bindPart("imu")} position={[0, 0.62, 0.37]}>
        <sphereGeometry args={[0.065, 12, 10]} />
        <meshStandardMaterial color="#dfaa6f" emissive="#694521" emissiveIntensity={0.34} />
      </mesh>
      <group {...bindPart("sensor")} position={[0.78, 0.34, -0.23]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.14, 0.16, 0.22, 16]} />
          <meshStandardMaterial color="#525b55" metalness={0.78} roughness={0.38} emissive={isHighlighted("sensor") ? "#29454a" : "#000000"} emissiveIntensity={isHighlighted("sensor") ? 0.4 : 0} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.035, 16]} />
          <meshStandardMaterial color="#83adb1" metalness={0.26} roughness={0.22} emissive="#294d52" emissiveIntensity={0.22} />
        </mesh>
      </group>
      <mesh position={[-0.47, 0.26, -0.62]}>
        <boxGeometry args={[0.15, 0.09, 0.12]} />
        <meshStandardMaterial color="#b5aa92" emissive="#6d5333" emissiveIntensity={0.42} roughness={0.32} />
      </mesh>
      <mesh position={[0.47, 0.26, -0.62]}>
        <boxGeometry args={[0.15, 0.09, 0.12]} />
        <meshStandardMaterial color="#b5aa92" emissive="#6d5333" emissiveIntensity={0.42} roughness={0.32} />
      </mesh>
      <pointLight position={[0, 0.26, -0.72]} intensity={2.2} distance={6} color="#e3cfaa" />
      <Line points={[[0, 0.15, -0.84], [0, 0.15, -5.2]]} color="#d29a5b" lineWidth={0.9} transparent opacity={0.34} />
      <Line points={[[0.91, 0.34, -0.24], [1.2, 0.48, -0.68], [1.75, 0.6, -1.33]]} color={detectionActive ? "#dca86b" : "#70aeb8"} lineWidth={1.1} transparent opacity={detectionActive ? 0.68 : 0.36} />
      <Line points={[[0.91, 0.34, -0.24], [1.52, 0.34, -1.37]]} color="#77b4bd" lineWidth={0.7} transparent opacity={0.24} />

      <group {...bindPart("controller")} position={[-0.32, 0.34, 0.16]}>
        <mesh castShadow><boxGeometry args={[0.38, 0.13, 0.34]} /><meshStandardMaterial color="#70766d" metalness={0.72} roughness={0.4} emissive={isHighlighted("controller") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("controller") ? 0.35 : 0} /></mesh>
        <mesh position={[0, 0.07, 0]}><boxGeometry args={[0.3, 0.012, 0.26]} /><meshStandardMaterial color="#343a36" metalness={0.68} roughness={0.46} /></mesh>
        <mesh position={[-0.14, 0.074, -0.11]}><cylinderGeometry args={[0.018, 0.018, 0.02, 8]} /><meshStandardMaterial color="#c1b99f" metalness={0.75} roughness={0.4} /></mesh>
        <mesh position={[0.14, 0.074, -0.11]}><cylinderGeometry args={[0.018, 0.018, 0.02, 8]} /><meshStandardMaterial color="#c1b99f" metalness={0.75} roughness={0.4} /></mesh>
        <mesh position={[-0.14, 0.074, 0.11]}><cylinderGeometry args={[0.018, 0.018, 0.02, 8]} /><meshStandardMaterial color="#c1b99f" metalness={0.75} roughness={0.4} /></mesh>
        <mesh position={[0.14, 0.074, 0.11]}><cylinderGeometry args={[0.018, 0.018, 0.02, 8]} /><meshStandardMaterial color="#c1b99f" metalness={0.75} roughness={0.4} /></mesh>
      </group>

      <group {...bindPart("battery")} position={[0.34, 0.34, 0.16]}>
        <mesh castShadow><boxGeometry args={[0.38, 0.13, 0.34]} /><meshStandardMaterial color="#424945" metalness={0.65} roughness={0.48} emissive={isHighlighted("battery") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("battery") ? 0.35 : 0} /></mesh>
        <mesh position={[0, 0.072, 0]}><boxGeometry args={[0.28, 0.012, 0.24]} /><meshStandardMaterial color="#74786e" metalness={0.72} roughness={0.42} /></mesh>
        <mesh position={[0.21, 0.01, 0]}><cylinderGeometry args={[0.065, 0.065, 0.07, 12]} /><meshStandardMaterial color="#232927" metalness={0.68} roughness={0.42} /></mesh>
      </group>

      <group {...bindPart("imu")} position={[0, 0.42, 0.42]}>
        <mesh><boxGeometry args={[0.19, 0.1, 0.16]} /><meshStandardMaterial color="#555e58" metalness={0.64} roughness={0.44} emissive={isHighlighted("imu") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("imu") ? 0.32 : 0} /></mesh>
        <mesh position={[0, 0.055, 0]}><boxGeometry args={[0.13, 0.012, 0.1]} /><meshStandardMaterial color="#232927" metalness={0.4} roughness={0.6} /></mesh>
      </group>

      <group {...bindPart("communication")} position={[0.48, 0.36, 0.46]}>
        <mesh><cylinderGeometry args={[0.09, 0.12, 0.12, 12]} /><meshStandardMaterial color="#59615a" metalness={0.72} roughness={0.42} emissive={isHighlighted("communication") ? "#55432b" : "#000000"} emissiveIntensity={isHighlighted("communication") ? 0.3 : 0} /></mesh>
        <mesh position={[0, 0.13, 0]}><cylinderGeometry args={[0.018, 0.026, 0.18, 8]} /><meshStandardMaterial color="#969487" metalness={0.78} roughness={0.36} /></mesh>
      </group>

      <Line points={[[0.16, 0.33, 0.39], [0.12, 0.43, 0.25], [-0.08, 0.42, 0.1], [-0.17, 0.4, 0.02]]} color="#252b29" lineWidth={3.2} />
      <Line points={[[0.16, 0.33, 0.39], [0.12, 0.43, 0.25], [-0.08, 0.42, 0.1], [-0.17, 0.4, 0.02]]} color="#7c8277" lineWidth={0.9} />

      {hoveredInfo && <Html position={[0.25, 1.05, 0]} center distanceFactor={10} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <aside className={styles.roverTooltip}>
          <span>{hoveredInfo.name}</span>
          <p>{hoveredInfo.description}</p>
        </aside>
      </Html>}
      {inspectionMode && roverParts.map((part) => (
        <Html key={part.id} position={partAnchors[part.id]} center distanceFactor={10} zIndexRange={[15, 0]}>
          <button
            type="button"
            className={styles.roverHotspot}
            aria-label={`Inspect ${part.name}`}
            aria-pressed={selectedPart === part.id}
            onPointerEnter={() => onHoverPart(part.id)}
            onPointerLeave={() => onHoverPart(null)}
            onClick={(event) => { event.stopPropagation(); onSelectPart(part.id); }}
          >
            <span aria-hidden="true" />
          </button>
        </Html>
      ))}
    </group>
  );
}