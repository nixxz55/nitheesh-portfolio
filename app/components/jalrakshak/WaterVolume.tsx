"use client";

import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PIPE_RADIUS = 4.3;
const WATER_LEVEL = 3.65;
const PIPE_LENGTH = 104;
const waterEdgeAngle = Math.acos(-WATER_LEVEL / PIPE_RADIUS);
const waterStartAngle = Math.PI * 2 - waterEdgeAngle;
const waterArcLength = waterEdgeAngle * 2;
const waterSurfaceWidth = Math.sqrt(PIPE_RADIUS ** 2 - WATER_LEVEL ** 2) * 2;
const bubbleCount = 36;

function BubbleField({ reducedMotion }: { reducedMotion: boolean }) {
  const bubbleMesh = useRef<THREE.InstancedMesh>(null);
  const bubbleTransform = useMemo(() => new THREE.Object3D(), []);
  const bubbleGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 6), []);
  const bubbleMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#91c0c7", transparent: true, opacity: 0.3, depthWrite: false }), []);

  useFrame(({ clock }) => {
    if (!bubbleMesh.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;

    for (let index = 0; index < bubbleCount; index += 1) {
      const phase = (index / bubbleCount + time * 0.035) % 1;
      const angle = index * 2.399;
      const x = Math.sin(angle) * 1.5;
      const y = -3.92 + phase * 7.25;
      const z = 2 - ((index * 13.71) % 96);
      const size = 0.026 + (index % 4) * 0.012;
      bubbleTransform.position.set(x, y, z);
      bubbleTransform.scale.setScalar(size);
      bubbleTransform.updateMatrix();
      bubbleMesh.current.setMatrixAt(index, bubbleTransform.matrix);
    }

    bubbleMesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={bubbleMesh} args={[bubbleGeometry, bubbleMaterial, bubbleCount]} frustumCulled={false} />;
}

export default function WaterVolume({ reducedMotion }: { reducedMotion: boolean }) {
  const surface = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (surface.current) surface.current.position.y = WATER_LEVEL + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.7) * 0.014);
  });

  return (
    <group>
      <mesh position={[0, 0, -43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[PIPE_RADIUS, PIPE_RADIUS, PIPE_LENGTH, 56, 24, true, waterStartAngle, waterArcLength]} />
        <meshStandardMaterial color="#17505d" metalness={0.06} roughness={0.2} transparent opacity={0.3} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={surface} position={[0, WATER_LEVEL, -43]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[waterSurfaceWidth, PIPE_LENGTH]} />
        <meshPhysicalMaterial color="#286977" metalness={0.04} roughness={0.16} clearcoat={0.42} clearcoatRoughness={0.2} transparent opacity={0.68} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[-waterSurfaceWidth / 2, WATER_LEVEL + 0.012, 7], [waterSurfaceWidth / 2, WATER_LEVEL + 0.012, 7]]} color="#85b5bc" lineWidth={0.8} transparent opacity={0.36} />
      <BubbleField reducedMotion={reducedMotion} />
    </group>
  );
}