import { Line, Text } from "@react-three/drei";
import * as THREE from "three";

const routeMarkers = [
  { distance: 0, z: 2 },
  { distance: 50, z: -23 },
  { distance: 100, z: -48 },
  { distance: 150, z: -73 },
];

const cutawayWidth = 1.8;
const cutawayStart = Math.PI / 2 - cutawayWidth / 2;

function PipeSpan({ centerZ, length, cutaway = false }: { centerZ: number; length: number; cutaway?: boolean }) {
  const thetaStart = cutaway ? cutawayStart + cutawayWidth : 0;
  const thetaLength = cutaway ? Math.PI * 2 - cutawayWidth : Math.PI * 2;

  return (
    <group position={[0, 0, centerZ]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[4.55, 4.55, length, 56, 28, true, thetaStart, thetaLength]} />
        <meshStandardMaterial color="#777970" metalness={0.2} roughness={0.88} side={THREE.DoubleSide} />
      </mesh>
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[4.4, 4.4, length - 0.05, 56, 24, true, thetaStart, thetaLength]} />
        <meshStandardMaterial color="#62675f" metalness={0.56} roughness={0.66} side={THREE.DoubleSide} />
      </mesh>
      {cutaway && (
        <mesh>
          <cylinderGeometry args={[4.405, 4.405, length - 0.08, 32, 18, true, cutawayStart, cutawayWidth]} />
          <meshPhysicalMaterial color="#6e9ca2" metalness={0.18} roughness={0.22} clearcoat={0.35} transparent opacity={0.34} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function PipeJoint({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh>
        <torusGeometry args={[4.37, 0.12, 8, 56]} />
        <meshStandardMaterial color="#969286" metalness={0.68} roughness={0.48} />
      </mesh>
      <mesh position={[0, 0, -0.13]}>
        <torusGeometry args={[4.25, 0.05, 8, 48]} />
        <meshStandardMaterial color="#343936" metalness={0.82} roughness={0.4} />
      </mesh>
      {Array.from({ length: 16 }, (_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 4.17, Math.sin(angle) * 4.17, 0.12]} rotation={[0, 0, -angle]}>
            <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
            <meshStandardMaterial color="#bbb5a4" metalness={0.74} roughness={0.42} />
          </mesh>
        );
      })}
      <mesh position={[3.8, -2.16, 0.05]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.34, 0.46, 0.3]} />
        <meshStandardMaterial color="#343b37" metalness={0.7} roughness={0.52} />
      </mesh>
      <mesh position={[-3.8, -2.16, 0.05]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.34, 0.46, 0.3]} />
        <meshStandardMaterial color="#343b37" metalness={0.7} roughness={0.52} />
      </mesh>
    </group>
  );
}

export default function Pipeline() {
  return (
    <group>
      <PipeSpan centerZ={-18} length={52} />
      <PipeSpan centerZ={-50} length={12} cutaway />
      <PipeSpan centerZ={-76} length={40} />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 4.34;
        const y = Math.sin(angle) * 4.34;
        return <Line key={index} points={[[x, y, 8], [x, y, -94]]} color="#99988c" lineWidth={0.7} transparent opacity={0.26} />;
      })}

      {[-7, -19.5, -32, -43.8, -56.2, -69.5, -82].map((z) => <PipeJoint key={z} z={z} />)}

      {[-1, 1].map((side) => (
        <mesh key={side} position={[3.37, side * 3.04, -50]}>
          <boxGeometry args={[0.18, 0.2, 12.1]} />
          <meshStandardMaterial color="#a5a092" metalness={0.78} roughness={0.46} />
        </mesh>
      ))}

      <mesh position={[0, 4.12, -43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 99, 12, 1, true]} />
        <meshStandardMaterial color="#9b998d" metalness={0.76} roughness={0.45} />
      </mesh>
      <mesh position={[0, -4.13, -43]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 99, 8, 1, true]} />
        <meshStandardMaterial color="#d09a61" metalness={0.4} roughness={0.56} emissive="#6a421f" emissiveIntensity={0.22} />
      </mesh>

      {routeMarkers.map(({ distance, z }) => (
        <group key={distance}>
          <Line points={[[-0.78, -4.16, z], [0.78, -4.16, z]]} color={distance === 100 ? "#d19a61" : "#a39a83"} lineWidth={distance === 100 ? 1.4 : 0.8} transparent opacity={0.86} />
          <Text position={[0, -3.86, z - 0.16]} fontSize={0.22} color={distance === 100 ? "#f0b779" : "#d0c7b2"} anchorX="center" anchorY="middle" letterSpacing={0.05}>{distance} m</Text>
        </group>
      ))}

      <mesh position={[0, -5.18, -43]} receiveShadow>
        <boxGeometry args={[18, 0.18, 112]} />
        <meshStandardMaterial color="#171a19" roughness={0.96} />
      </mesh>
      <mesh position={[0, -4.96, -43]}>
        <boxGeometry args={[11, 0.16, 108]} />
        <meshStandardMaterial color="#303531" metalness={0.38} roughness={0.78} />
      </mesh>
      {[-7, -32, -57, -82].map((z) => (
        <group key={z} position={[0, -4.83, z]}>
          <mesh position={[-3.15, 0, 0]}><boxGeometry args={[0.3, 0.35, 0.52]} /><meshStandardMaterial color="#414440" metalness={0.7} roughness={0.46} /></mesh>
          <mesh position={[3.15, 0, 0]}><boxGeometry args={[0.3, 0.35, 0.52]} /><meshStandardMaterial color="#414440" metalness={0.7} roughness={0.46} /></mesh>
        </group>
      ))}
    </group>
  );
}