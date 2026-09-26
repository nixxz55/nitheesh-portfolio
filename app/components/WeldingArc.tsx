"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const sparkCount = 12;

export default function WeldingArc({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  const sparks = useRef<THREE.InstancedMesh>(null);
  const transform = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.OctahedronGeometry(1, 0), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: "#f1c684" }), []);

  useFrame(({ clock }) => {
    if (!sparks.current) return;
    sparks.current.visible = active;
    if (!active) return;

    const time = reducedMotion ? 0 : clock.elapsedTime;
    for (let index = 0; index < sparkCount; index += 1) {
      const phase = reducedMotion ? index / sparkCount : (index / sparkCount + time * 0.62) % 1;
      const angle = index * 2.399 + time * (reducedMotion ? 0 : 1.4);
      const spread = 0.025 + phase * 0.11;
      transform.position.set(Math.cos(angle) * spread, -phase * 0.17, Math.sin(angle) * spread);
      transform.scale.setScalar(0.009 + (1 - phase) * 0.018);
      transform.updateMatrix();
      sparks.current.setMatrixAt(index, transform.matrix);
    }

    sparks.current.instanceMatrix.needsUpdate = true;
  });

  return <group visible={active}>
    <mesh>
      <sphereGeometry args={[0.045, 10, 10]} />
      <meshBasicMaterial color="#fff0c4" />
    </mesh>
    <mesh>
      <torusGeometry args={[0.075, 0.012, 5, 16]} />
      <meshBasicMaterial color="#dfa65f" transparent opacity={0.54} />
    </mesh>
    <pointLight intensity={3.4} distance={2.4} color="#f0c17d" />
    <instancedMesh ref={sparks} args={[geometry, material, sparkCount]} frustumCulled={false} />
  </group>;
}