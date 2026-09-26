import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function LeakZone({ active, onSelect, reducedMotion }: { active: boolean; onSelect: () => void; reducedMotion: boolean }) {
  const firstDrop = useRef<THREE.Mesh>(null);
  const secondDrop = useRef<THREE.Mesh>(null);
  const thirdDrop = useRef<THREE.Mesh>(null);
  const color = active ? "#d88455" : "#b98a5c";

  useFrame(({ clock }) => {
    const time = reducedMotion ? 0 : clock.elapsedTime * 0.42;
    const updateDrop = (drop: THREE.Mesh | null, phase: number, spread: number) => {
      if (!drop) return;
      const travel = (time + phase) % 1;
      drop.position.set(0.12 + spread * travel, -0.06 - spread * travel * 0.16, 0.1 + travel * 1.28);
    };
    updateDrop(firstDrop.current, 0, 0.12);
    updateDrop(secondDrop.current, 0.38, -0.08);
    updateDrop(thirdDrop.current, 0.72, 0.04);
  });

  return (
    <group position={[3.91, -2, -50]} rotation={[0, Math.PI / 2, 0]}>
      <mesh onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <sphereGeometry args={[0.7, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh scale={active ? 1.08 : 1}>
        <torusGeometry args={[0.39, active ? 0.022 : 0.014, 6, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={active ? 0.32 : 0.08} metalness={0.3} roughness={0.58} />
      </mesh>
      <Line points={[[-0.26, 0.3, 0.02], [-0.11, 0.16, 0.04], [-0.18, 0.02, 0.03], [0.07, -0.12, 0.05], [-0.02, -0.26, 0.025], [0.17, -0.39, 0.04]]} color="#24201c" lineWidth={4} />
      <Line points={[[-0.26, 0.3, 0.045], [-0.11, 0.16, 0.055], [-0.18, 0.02, 0.05], [0.07, -0.12, 0.065], [-0.02, -0.26, 0.045], [0.17, -0.39, 0.06]]} color={color} lineWidth={active ? 1.5 : 1.1} />
      <Line points={[[0.08, -0.06, 0.025], [0.12, -0.04, 0.28], [0.16, -0.06, 0.64], [0.21, -0.1, 1.02], [0.26, -0.15, 1.48]]} color="#78aeb7" lineWidth={3.2} transparent opacity={0.22} />
      <Line points={[[0.08, -0.06, 0.03], [0.12, -0.04, 0.28], [0.16, -0.06, 0.64], [0.21, -0.1, 1.02], [0.26, -0.15, 1.48]]} color="#b0d1d1" lineWidth={1.25} transparent opacity={0.68} />
      <mesh ref={firstDrop} position={[0.12, -0.06, 0.1]}>
        <sphereGeometry args={[0.06, 10, 8]} />
        <meshStandardMaterial color="#b5d3d4" metalness={0.08} roughness={0.18} />
      </mesh>
      <mesh ref={secondDrop} position={[0.12, -0.06, 0.56]}>
        <sphereGeometry args={[0.047, 9, 7]} />
        <meshStandardMaterial color="#a9cbd0" metalness={0.08} roughness={0.18} />
      </mesh>
      <mesh ref={thirdDrop} position={[0.12, -0.06, 1.02]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color="#b5d3d4" metalness={0.08} roughness={0.18} />
      </mesh>
    </group>
  );
}