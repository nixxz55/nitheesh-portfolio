import { Line, RoundedBox, Text } from "@react-three/drei";

export type WorkcellStatus = { mode: string; status: string };

function FixtureClamp({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <RoundedBox args={[0.18, 0.08, 0.2]} radius={0.025} smoothness={2} position={[0, 0.01, 0]}><meshStandardMaterial color="#777970" metalness={0.78} roughness={0.38} /></RoundedBox>
    <mesh position={[0, 0.105, 0]}><boxGeometry args={[0.08, 0.16, 0.08]} /><meshStandardMaterial color="#4a514c" metalness={0.78} roughness={0.4} /></mesh>
    <mesh position={[0, 0.19, 0.08]} rotation={[0, 0, -0.12]}><boxGeometry args={[0.34, 0.055, 0.1]} /><meshStandardMaterial color="#99978a" metalness={0.8} roughness={0.34} /></mesh>
    <mesh position={[0, 0.15, 0.2]}><cylinderGeometry args={[0.045, 0.045, 0.09, 10]} /><meshStandardMaterial color="#c1b99f" metalness={0.86} roughness={0.28} /></mesh>
  </group>;
}

function WeldingFixture() {
  return <group>
    <RoundedBox args={[2.02, 0.1, 1.2]} radius={0.025} smoothness={2} position={[0, 0.12, 0.06]} castShadow><meshStandardMaterial color="#4d5550" metalness={0.78} roughness={0.42} /></RoundedBox>
    <mesh position={[0, 0.18, 0.06]}><boxGeometry args={[1.84, 0.025, 0.98]} /><meshStandardMaterial color="#282f2c" metalness={0.74} roughness={0.5} /></mesh>
    {[-0.34, 0.34].map((z) => <Line key={z} points={[[-0.84, 0.2, z], [0.84, 0.2, z]]} color="#a38d68" lineWidth={0.7} transparent opacity={0.62} />)}

    <RoundedBox args={[1.22, 0.11, 0.48]} radius={0.035} smoothness={3} position={[0, 0.25, -0.25]} castShadow><meshStandardMaterial color="#a4a398" metalness={0.76} roughness={0.34} /></RoundedBox>
    <RoundedBox args={[1.22, 0.11, 0.48]} radius={0.035} smoothness={3} position={[0, 0.25, 0.25]} castShadow><meshStandardMaterial color="#b6b1a3" metalness={0.72} roughness={0.38} /></RoundedBox>
    <mesh position={[0, 0.31, 0]}><boxGeometry args={[1.02, 0.018, 0.025]} /><meshStandardMaterial color="#302a24" metalness={0.35} roughness={0.65} /></mesh>
    <Line points={[[-0.52, 0.325, 0], [0.52, 0.325, 0]]} color="#d39151" lineWidth={0.8} transparent opacity={0.68} />

    {[-1, 1].flatMap((side) => [-1, 1].map((end) => <FixtureClamp key={`${side}-${end}`} position={[side * 0.72, 0.17, end * 0.36]} />))}

    <mesh position={[0.98, 0.2, -0.43]}>
      <boxGeometry args={[0.48, 0.08, 0.42]} />
      <meshStandardMaterial color="#333936" metalness={0.72} roughness={0.48} />
    </mesh>
    <mesh position={[0.98, 0.26, -0.43]}>
      <boxGeometry args={[0.4, 0.045, 0.34]} />
      <meshStandardMaterial color="#777970" metalness={0.78} roughness={0.4} />
    </mesh>
  </group>;
}

function SafetyGuard() {
  return <group>
    <mesh position={[0, 0.72, 0.72]}>
      <boxGeometry args={[2.05, 1.05, 0.035]} />
      <meshPhysicalMaterial color="#7f9175" metalness={0.12} roughness={0.25} transparent opacity={0.2} depthWrite={false} />
    </mesh>
    <mesh position={[0, 1.27, 0.72]}><boxGeometry args={[2.18, 0.07, 0.08]} /><meshStandardMaterial color="#4a514c" metalness={0.78} roughness={0.42} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[side * 1.05, 0.72, 0.72]}><boxGeometry args={[0.07, 1.12, 0.08]} /><meshStandardMaterial color="#75776f" metalness={0.8} roughness={0.36} /></mesh>)}
  </group>;
}

function WorkcellStatusDisplay({ status }: { status: WorkcellStatus }) {
  return <group position={[1.13, 0.72, 0.83]} rotation={[0, 0.05, 0]}>
    <RoundedBox args={[1.42, 0.92, 0.1]} radius={0.045} smoothness={3} castShadow><meshStandardMaterial color="#303735" metalness={0.72} roughness={0.34} /></RoundedBox>
    <mesh position={[0, 0, 0.056]}><planeGeometry args={[1.25, 0.76]} /><meshStandardMaterial color="#171e1c" emissive="#26301f" emissiveIntensity={0.1} /></mesh>
    <Text position={[-0.56, 0.3, 0.07]} fontSize={0.085} color="#f0e9d8" anchorX="left" anchorY="middle">ROBOT WORKCELL</Text>
    <Text position={[-0.56, 0.18, 0.07]} fontSize={0.043} color="#d19a5f" anchorX="left" anchorY="middle" letterSpacing={0.025}>INDUSTRIAL ROBOT WORKCELL</Text>
    <Text position={[-0.56, 0.09, 0.07]} fontSize={0.043} color="#d19a5f" anchorX="left" anchorY="middle" letterSpacing={0.025}>SIMULATION</Text>
    <Line points={[[-0.56, 0.01, 0.07], [0.56, 0.01, 0.07]]} color="#667066" lineWidth={0.55} />
    <Text position={[-0.56, -0.1, 0.07]} fontSize={0.052} color="#d9d5c8" anchorX="left" anchorY="middle">MODE     {status.mode}</Text>
    <Text position={[-0.56, -0.23, 0.07]} fontSize={0.052} color="#d9d5c8" anchorX="left" anchorY="middle">STATUS   {status.status}</Text>
    <Text position={[-0.56, -0.36, 0.07]} fontSize={0.052} color="#c7a878" anchorX="left" anchorY="middle">TASK     JOINT WELD</Text>
    <Text position={[0.11, -0.36, 0.07]} fontSize={0.045} color="#97a195" anchorX="left" anchorY="middle">SIM</Text>
  </group>;
}

export default function WeldingWorkcell({ status }: { status: WorkcellStatus }) {
  return <>
    <group position={[0, 2.52, 4.12]}>
      <RoundedBox args={[2.8, 0.16, 1.65]} radius={0.055} smoothness={3} castShadow receiveShadow><meshStandardMaterial color="#4b514e" metalness={0.76} roughness={0.38} /></RoundedBox>
      <mesh position={[0, -1.27, 0]}><boxGeometry args={[2.5, 0.12, 1.42]} /><meshStandardMaterial color="#363d39" metalness={0.7} roughness={0.45} /></mesh>
      {[-1, 1].flatMap((x) => [-1, 1].map((z) => <mesh key={`${x}-${z}`} position={[x * 1.22, -0.66, z * 0.65]}><boxGeometry args={[0.12, 1.2, 0.12]} /><meshStandardMaterial color="#3f4642" metalness={0.68} roughness={0.48} /></mesh>))}
      <WeldingFixture />
      <SafetyGuard />
    </group>
    <WorkcellStatusDisplay status={status} />
    <Line points={[[-1.62, 0.018, 3.1], [1.62, 0.018, 3.1], [1.62, 0.018, 5.15], [-1.62, 0.018, 5.15], [-1.62, 0.018, 3.1]]} color="#b1884d" lineWidth={1.1} transparent opacity={0.5} />
  </>;
}