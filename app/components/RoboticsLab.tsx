"use client";

import { useFrame } from "@react-three/fiber";
import { Cylinder, Line, RoundedBox, Text } from "@react-three/drei";
import { useRef } from "react";
import type { ReactNode } from "react";
import * as THREE from "three";

export type Station = "arrival" | "about" | "focus" | "work" | "contact" | "overview";

type StationView = {
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  boardPosition: [number, number, number];
  boardFrontDirection: [number, number, number];
  boardRotation: [number, number, number];
};

const stationViews: Record<Station, StationView> = {
  arrival: { cameraPosition: [8.4, 6.4, 8.8], cameraTarget: [0, 2.15, 0], boardPosition: [0, 1.3, 0], boardFrontDirection: [0, 0, 1], boardRotation: [0, 0, 0] },
  about: { cameraPosition: [-6.8, 6.2, 7.4], cameraTarget: [-0.85, 2.15, 1.05], boardPosition: [-3.1, 1.9, 2.6], boardFrontDirection: [-0.707, 0, 0.707], boardRotation: [0, -0.785, 0] },
  focus: { cameraPosition: [-8.2, 6.2, -6.05], cameraTarget: [-1.9, 2.05, -2.15], boardPosition: [-3.8, 1.82, -4.35], boardFrontDirection: [-0.919, 0, -0.389], boardRotation: [0, -1.971, 0] },
  work: { cameraPosition: [8.2, 6.2, -6.05], cameraTarget: [1.75, 2.05, -2.15], boardPosition: [3.5, 1.8, -4.25], boardFrontDirection: [0.956, 0, -0.293], boardRotation: [0, 1.868, 0] },
  contact: { cameraPosition: [6.9, 6.2, 7.4], cameraTarget: [1.1, 2.15, 1.05], boardPosition: [3.7, 1.86, 2.5], boardFrontDirection: [0.781, 0, 0.625], boardRotation: [0, 0.896, 0] },
  overview: { cameraPosition: [8.8, 8, 9.8], cameraTarget: [0, 2.2, 0], boardPosition: [0, 1, 0], boardFrontDirection: [0, 0, 1], boardRotation: [0, 0, 0] },
};

export function CameraRig({ station }: { station: Station }) {
  const target = useRef(new THREE.Vector3());
  useFrame(({ camera }) => {
    const destination = stationViews[station];
    camera.position.lerp(new THREE.Vector3(...destination.cameraPosition), 0.045);
    target.current.lerp(new THREE.Vector3(...destination.cameraTarget), 0.06);
    camera.lookAt(target.current);
  });
  return null;
}

function Panel({ position, rotation = [0, 0, 0], title, lines }: { position: [number, number, number]; rotation?: [number, number, number]; title: string; lines: string[] }) {
  return <group position={position} rotation={rotation}><RoundedBox args={[2.4, 1.45, 0.12]} radius={0.06} smoothness={3}><meshStandardMaterial color="#1c2425" metalness={0.6} roughness={0.32} /></RoundedBox><mesh position={[0, 0, 0.08]}><planeGeometry args={[2.08, 1.12]} /><meshStandardMaterial color="#d6c9aa" emissive="#3c2c1b" emissiveIntensity={0.18} /></mesh><Text position={[-0.9, 0.42, 0.15]} fontSize={0.13} color="#171b1a" anchorX="left" anchorY="middle" letterSpacing={0.04}>{title}</Text>{lines.map((line, index) => <Text key={line} position={[-0.9, 0.14 - index * 0.2, 0.15]} fontSize={0.09} color="#3f4843" anchorX="left" anchorY="middle">{line}</Text>)}</group>;
}

function BoardFrame({ position, rotation, children, screenColor = "#d6c9aa" }: { position: [number, number, number]; rotation: [number, number, number]; children: ReactNode; screenColor?: string }) {
  return <group position={position} rotation={rotation}><RoundedBox args={[2.52, 1.55, 0.16]} radius={0.08} smoothness={4} castShadow><meshStandardMaterial color="#303735" metalness={0.78} roughness={0.28} /></RoundedBox><mesh position={[0, 0, 0.1]}><planeGeometry args={[2.22, 1.25]} /><meshStandardMaterial color={screenColor} metalness={0.16} roughness={0.55} /></mesh>{children}</group>;
}

function StatusLights({ positions = [[-0.92, 0.57, 0.14], [-0.72, 0.57, 0.14]] }: { positions?: [number, number, number][] }) {
  return <group>{positions.map((position, index) => <mesh key={index} position={position}><sphereGeometry args={[0.035, 10, 10]} /><meshStandardMaterial color={index === 0 ? "#bd7b3d" : "#789078"} emissive={index === 0 ? "#6c3511" : "#263d2b"} emissiveIntensity={0.35} /></mesh>)}</group>;
}

function IdentityBoard({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <BoardFrame position={position} rotation={rotation} screenColor="#e0d9c7"><StatusLights /><Text position={[-0.92, 0.47, 0.15]} fontSize={0.16} color="#161b1a" anchorX="left">NITHEESH K</Text><Text position={[-0.92, 0.19, 0.15]} fontSize={0.105} color="#303b37" anchorX="left">ROBOTICS</Text><Text position={[-0.92, 0.03, 0.15]} fontSize={0.105} color="#303b37" anchorX="left">&amp; AUTOMATION</Text><Text position={[0.1, 0.25, 0.15]} fontSize={0.09} color="#9a6030" anchorX="left">ROBOTICS / 03</Text><Text position={[-0.92, -0.2, 0.15]} fontSize={0.07} color="#4d5750" anchorX="left">ENGINEERING STUDENT</Text><Text position={[-0.92, -0.36, 0.15]} fontSize={0.055} color="#4d5750" anchorX="left">ERODE SENGUNTHAR ENGINEERING COLLEGE</Text><Line points={[[-0.92, -0.48, 0.16], [0.92, -0.48, 0.16]]} color="#a76b34" lineWidth={0.6} /><Text position={[-0.92, -0.59, 0.15]} fontSize={0.05} color="#53615a" anchorX="left">Interested in Robotics R&amp;D</Text><Text position={[0.58, -0.59, 0.15]} fontSize={0.045} color="#53615a" anchorX="left">NK-01</Text></BoardFrame>;
}

function FocusBoard({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <BoardFrame position={position} rotation={rotation} screenColor="#182322"><StatusLights positions={[[0.72, 0.57, 0.14], [0.88, 0.57, 0.14]]} /><Text position={[-0.96, 0.49, 0.15]} fontSize={0.135} color="#e0d8c5" anchorX="left">CURRENT FOCUS</Text><Text position={[-0.96, 0.21, 0.15]} fontSize={0.078} color="#c58645" anchorX="left">ROS 2</Text><Text position={[-0.96, 0.04, 0.15]} fontSize={0.078} color="#c5c9b8" anchorX="left">ROBOT SIMULATION</Text><Text position={[-0.96, -0.13, 0.15]} fontSize={0.078} color="#c5c9b8" anchorX="left">COMPUTER VISION</Text><Text position={[0.15, 0.21, 0.15]} fontSize={0.078} color="#c5c9b8" anchorX="left">LINUX</Text><Text position={[0.15, 0.04, 0.15]} fontSize={0.078} color="#c5c9b8" anchorX="left">AUTOMATION</Text><Text position={[0.15, -0.13, 0.15]} fontSize={0.078} color="#c5c9b8" anchorX="left">AI / ML</Text><Line points={[[-0.96, -0.34, 0.15], [0.95, -0.34, 0.15]]} color="#60706a" lineWidth={0.5} /><Text position={[-0.96, -0.5, 0.15]} fontSize={0.065} color="#c58645" anchorX="left">MODE</Text><Text position={[-0.45, -0.5, 0.15]} fontSize={0.052} color="#aeb7a8" anchorX="left">LEARNING → EXPLORING → BUILDING</Text></BoardFrame>;
}

function LogBoard({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <BoardFrame position={position} rotation={rotation} screenColor="#c5baa0"><Text position={[-0.96, 0.5, 0.15]} fontSize={0.13} color="#252d2a" anchorX="left">ENGINEERING LOG</Text><Line points={[[-0.96, 0.36, 0.15], [0.96, 0.36, 0.15]]} color="#8e795b" lineWidth={0.5} /><Text position={[-0.96, 0.17, 0.15]} fontSize={0.06} color="#ad6031" anchorX="left">01</Text><Text position={[-0.72, 0.17, 0.15]} fontSize={0.06} color="#3f4a43" anchorX="left">BUILDING ROBOTICS FOUNDATION</Text><Text position={[-0.96, -0.01, 0.15]} fontSize={0.06} color="#ad6031" anchorX="left">02</Text><Text position={[-0.72, -0.01, 0.15]} fontSize={0.06} color="#3f4a43" anchorX="left">EXPLORING ROS 2</Text><Text position={[-0.96, -0.19, 0.15]} fontSize={0.06} color="#ad6031" anchorX="left">03</Text><Text position={[-0.72, -0.19, 0.15]} fontSize={0.06} color="#3f4a43" anchorX="left">UNDERSTANDING ROBOT SIMULATION</Text><Text position={[-0.96, -0.37, 0.15]} fontSize={0.06} color="#ad6031" anchorX="left">04</Text><Text position={[-0.72, -0.37, 0.15]} fontSize={0.06} color="#3f4a43" anchorX="left">EXPLORING COMPUTER VISION</Text><Text position={[-0.96, -0.58, 0.15]} fontSize={0.065} color="#73593e" anchorX="left">LEARNING IN PROGRESS</Text></BoardFrame>;
}

function ContactBoard({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return <BoardFrame position={position} rotation={rotation} screenColor="#172221"><StatusLights positions={[[0.74, 0.57, 0.14], [0.88, 0.57, 0.14]]} /><Text position={[-0.96, 0.48, 0.15]} fontSize={0.12} color="#e1d8c3" anchorX="left">COMMUNICATION TERMINAL</Text><Text position={[-0.96, 0.23, 0.15]} fontSize={0.09} color="#c48748" anchorX="left">NITHEESH K</Text><Text position={[-0.96, 0.01, 0.15]} fontSize={0.075} color="#c2c9ba" anchorX="left">CONNECT</Text>{["GITHUB", "LINKEDIN", "EMAIL", "MOBILE"].map((label, index) => <group key={label}><RoundedBox args={[0.82, 0.12, 0.025]} radius={0.02} smoothness={2} position={[-0.52 + (index % 2) * 0.9, -0.2 - Math.floor(index / 2) * 0.2, 0.15]}><meshStandardMaterial color="#303d38" metalness={0.52} roughness={0.35} /></RoundedBox><Text position={[-0.82 + (index % 2) * 0.9, -0.2 - Math.floor(index / 2) * 0.2, 0.18]} fontSize={0.055} color="#d1c7b0" anchorX="left">{label}</Text></group>)}<Text position={[-0.96, -0.59, 0.15]} fontSize={0.055} color="#798c7e" anchorX="left">ROBOTICS / CONNECT</Text><Text position={[0.15, -0.59, 0.15]} fontSize={0.05} color="#c48748" anchorX="left">OPEN TO CONNECTIONS</Text></BoardFrame>;
}

export function LabEnvironment({ station }: { station: Station }) {
  return <group>
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[22, 20]} /><meshStandardMaterial color="#242829" roughness={0.74} metalness={0.14} /></mesh>
    <gridHelper args={[20, 40, "#4a4a42", "#303633"]} position={[0, 0.012, 0]} />
    <mesh position={[0, 4.3, -7]}><boxGeometry args={[19, 8.6, 0.18]} /><meshStandardMaterial color="#171c1d" roughness={0.88} /></mesh>
    <mesh position={[-10.5, 4.3, 0]}><boxGeometry args={[0.18, 8.6, 14]} /><meshStandardMaterial color="#171c1d" roughness={0.88} /></mesh>
    <mesh position={[0, 8.35, 0]}><boxGeometry args={[20.5, 0.14, 14]} /><meshStandardMaterial color="#171c1d" roughness={0.9} /></mesh>
    {[[-9.6, 3.8, -6.6], [9.6, 3.8, -6.6], [-9.6, 3.8, 6.2], [9.6, 3.8, 6.2]].map((position) => <mesh key={position.join()} position={position as [number, number, number]}><boxGeometry args={[0.18, 7.6, 0.18]} /><meshStandardMaterial color="#58605c" metalness={0.72} roughness={0.35} /></mesh>)}
    <mesh receiveShadow position={[0, 0.3, 0]}><cylinderGeometry args={[2.05, 2.15, 0.6, 48]} /><meshStandardMaterial color="#535b57" metalness={0.8} roughness={0.28} /></mesh>
    <mesh position={[0, 0.62, 0]}><cylinderGeometry args={[1.65, 1.72, 0.08, 48]} /><meshStandardMaterial color="#151a1a" metalness={0.52} roughness={0.28} /></mesh>
    <Text position={[0, 0.68, -1.1]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.16} color="#bd7a37" anchorX="center">06 AXIS</Text>
    <Workbench position={[-3.1, 0.76, 2.8]} rotation={[0, 0.1, 0]} label="OPERATOR CONSOLE" />
    <Workbench position={[-3.8, 0.7, -4.35]} rotation={[0, 0.1, 0]} label="ENGINEERING DESK" />
    <Workbench position={[3.5, 0.68, -4.25]} rotation={[0, -0.12, 0]} label="INSPECTION BENCH" />
    <Workbench position={[3.7, 0.74, 2.5]} rotation={[0, -0.16, 0]} label="COMMS TERMINAL" />
    <IdentityBoard position={stationViews.about.boardPosition} rotation={stationViews.about.boardRotation} />
    <FocusBoard position={stationViews.focus.boardPosition} rotation={stationViews.focus.boardRotation} />
    <LogBoard position={stationViews.work.boardPosition} rotation={stationViews.work.boardRotation} />
    <ContactBoard position={stationViews.contact.boardPosition} rotation={stationViews.contact.boardRotation} />
    <Line points={[[-6, 0.04, 0], [6, 0.04, 0]]} color="#a96b32" lineWidth={0.6} transparent opacity={0.3} />
    <Text position={[0, 4.05, -6.86]} fontSize={0.16} color="#9d8d72" anchorX="center" letterSpacing={0.16}>NITHEESH&apos;S ROBOTICS WORKSPACE</Text>
  </group>;
}

function Workbench({ position, rotation, label }: { position: [number, number, number]; rotation: [number, number, number]; label: string }) {
  return <group position={position} rotation={rotation}><RoundedBox args={[2.6, 0.16, 1.2]} radius={0.04} smoothness={2}><meshStandardMaterial color="#4b514e" metalness={0.72} roughness={0.32} /></RoundedBox>{[-1, 1].flatMap((x) => [-1, 1].map((z) => <mesh key={`${x}${z}`} position={[x * 1.05, -0.55, z * 0.38]}><boxGeometry args={[0.1, 1.05, 0.1]} /><meshStandardMaterial color="#252c2b" metalness={0.4} /></mesh>))}<Text position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.1} color="#c08a4d" anchorX="center">{label}</Text></group>;
}

function Fasteners({ radius, count = 6, y = 0 }: { radius: number; count?: number; y?: number }) {
  return <group position={[0, y, 0]}>{Array.from({ length: count }, (_, index) => { const angle = (index / count) * Math.PI * 2; return <mesh key={index} position={[Math.cos(angle) * radius, 0.025, Math.sin(angle) * radius]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.025, 8]} /><meshStandardMaterial color="#9b9d94" metalness={0.9} roughness={0.22} /></mesh>; })}</group>;
}

function JointHousing({ radius, depth, axis = "x" }: { radius: number; depth: number; axis?: "x" | "y" }) {
  return <group rotation={axis === "x" ? [0, 0, Math.PI / 2] : [0, 0, 0]}><mesh castShadow><cylinderGeometry args={[radius, radius * 1.04, depth, 32]} /><meshStandardMaterial color="#222827" metalness={0.86} roughness={0.24} /></mesh><mesh position={[0, depth / 2 + 0.012, 0]}><torusGeometry args={[radius * 0.72, 0.035, 8, 24]} /><meshStandardMaterial color="#686c64" metalness={0.8} roughness={0.26} /></mesh></group>;
}

function AxisLabel({ position, value }: { position: [number, number, number]; value: string }) {
  return <Text position={position} fontSize={0.075} color="#ad7339" anchorX="center" anchorY="middle" letterSpacing={0.08}>{value}</Text>;
}

function CableBundle() {
  return <group><Line points={[[0.48, 0.7, 0.18], [0.58, 1.35, 0.2], [0.47, 2.05, 0.2], [0.36, 2.7, 0.18], [0.3, 3.3, 0.16]]} color="#171b1b" lineWidth={7} /><Line points={[[0.48, 0.7, 0.18], [0.58, 1.35, 0.2], [0.47, 2.05, 0.2], [0.36, 2.7, 0.18], [0.3, 3.3, 0.16]]} color="#4a504a" lineWidth={2} /></group>;
}

function JointCable({ points }: { points: [number, number, number][] }) {
  return <group><Line points={points} color="#111615" lineWidth={4} /><Line points={points} color="#4d554e" lineWidth={1.1} /></group>;
}

type JointState = { current: number; velocity: number; min: number; max: number; speed: number; acceleration: number };

const stationPoseAdjustments: Record<Station, [number, number, number, number, number]> = {
  arrival: [-0.38, 0.72, 0, -0.2, 0],
  about: [-0.32, 0.62, -0.08, -0.16, 0.04],
  focus: [-0.5, 0.78, 0.12, -0.24, -0.08],
  work: [-0.76, 0.98, -0.12, -0.34, 0.1],
  contact: [-0.4, 0.68, 0.04, -0.14, 0],
  overview: [-0.38, 0.7, 0, -0.18, 0],
};

function stationPose(station: Station): [number, number, number, number, number, number] {
  const [x, , z] = stationViews[station].boardPosition;
  const baseAngle = station === "arrival" || station === "overview" ? 0 : Math.atan2(x, z);
  return [baseAngle, ...stationPoseAdjustments[station]];
}

const jointLimits: Array<Omit<JointState, "current" | "velocity">> = [
  { min: -Math.PI, max: Math.PI, speed: 0.72, acceleration: 1.5 },
  { min: -1.1, max: 0.2, speed: 0.48, acceleration: 1.05 },
  { min: 0.18, max: 1.35, speed: 0.58, acceleration: 1.2 },
  { min: -1.2, max: 1.2, speed: 0.9, acceleration: 1.8 },
  { min: -0.95, max: 0.65, speed: 0.75, acceleration: 1.55 },
  { min: -1.4, max: 1.4, speed: 1.1, acceleration: 2.2 },
];

function createJointStates(): JointState[] {
  return jointLimits.map((limit, index) => ({ ...limit, current: stationPose("arrival")[index], velocity: 0 }));
}

function advanceJoint(joint: JointState, target: number, deltaTime: number) {
  const targetDelta = target - joint.current;
  const shortestDelta = Math.atan2(Math.sin(targetDelta), Math.cos(targetDelta));
  const continuousTarget = joint.min === -Math.PI && joint.max === Math.PI ? joint.current + shortestDelta : target;
  const boundedTarget = THREE.MathUtils.clamp(continuousTarget, joint.min, joint.max);
  const distance = boundedTarget - joint.current;
  const brakingSpeed = Math.sqrt(Math.max(0, Math.abs(distance) * joint.acceleration * 2));
  const desiredSpeed = Math.sign(distance) * Math.min(joint.speed, brakingSpeed);
  joint.velocity = THREE.MathUtils.damp(joint.velocity, desiredSpeed, joint.acceleration, deltaTime);
  joint.current = THREE.MathUtils.clamp(joint.current + joint.velocity * deltaTime, joint.min, joint.max);
  if (Math.abs(distance) < 0.002 && Math.abs(joint.velocity) < 0.01) { joint.current = boundedTarget; joint.velocity = 0; }
  return joint.current;
}

export function RobotArm({ station }: { station: Station }) {
  const root = useRef<THREE.Group>(null);
  const baseJoint = useRef<THREE.Group>(null);
  const axis2 = useRef<THREE.Group>(null);
  const axis3 = useRef<THREE.Group>(null);
  const axis4 = useRef<THREE.Group>(null);
  const axis5 = useRef<THREE.Group>(null);
  const axis6 = useRef<THREE.Group>(null);
  const robotBasePosition = useRef(new THREE.Vector3());
  const cameraDirection = useRef(new THREE.Vector3());
  const joints = useRef<JointState[]>(createJointStates());
  const idle = useRef({ nextChange: 5, activeAxis: -1, amount: 0 });

  useFrame(({ clock, pointer, camera }, delta) => {
    const time = clock.elapsedTime;
    const deltaTime = Math.min(delta, 0.05);
    if (!root.current || !baseJoint.current || !axis2.current || !axis3.current || !axis4.current || !axis5.current || !axis6.current) return;
    if (time >= idle.current.nextChange) {
      if (idle.current.activeAxis >= 0) idle.current.amount = 0;
      idle.current.activeAxis = idle.current.activeAxis === 2 ? 4 : 2;
      idle.current.amount = idle.current.activeAxis === 2 ? 0.035 : -0.045;
      idle.current.nextChange = time + 5.5;
    }
    const targets = [...stationPose(station)];
    baseJoint.current.getWorldPosition(robotBasePosition.current);
    cameraDirection.current.subVectors(camera.position, robotBasePosition.current);
    cameraDirection.current.y = 0;
    const cameraAngle = Math.atan2(cameraDirection.current.x, cameraDirection.current.z);
    const cameraPoseDelta = Math.atan2(Math.sin(cameraAngle - targets[0]), Math.cos(cameraAngle - targets[0]));
    targets[0] = cameraAngle;
    targets[1] += THREE.MathUtils.clamp(cameraPoseDelta * 0.08, -0.12, 0.12);
    targets[2] += THREE.MathUtils.clamp(Math.abs(cameraPoseDelta) * 0.06, 0, 0.09);
    targets[3] += THREE.MathUtils.clamp(cameraPoseDelta * 0.12, -0.14, 0.14);
    targets[4] += THREE.MathUtils.clamp(-cameraPoseDelta * 0.08, -0.1, 0.1);
    targets[5] += THREE.MathUtils.clamp(cameraPoseDelta * 0.16, -0.16, 0.16);
    if (idle.current.activeAxis >= 0) targets[idle.current.activeAxis] += idle.current.amount;
    targets[4] += pointer.y * 0.025;
    targets[5] += pointer.x * 0.02;
    const angles = joints.current.map((joint, index) => advanceJoint(joint, targets[index], deltaTime));
    baseJoint.current.rotation.y = angles[0];
    axis2.current.rotation.z = angles[1];
    axis3.current.rotation.z = angles[2];
    axis4.current.rotation.y = angles[3];
    axis5.current.rotation.z = angles[4];
    axis6.current.rotation.y = angles[5];
  });

  return <group ref={root} position={[0, 0.68, 0]}>
    <group ref={baseJoint}>
    <Cylinder args={[0.96, 1.06, 0.16, 48]} castShadow><meshStandardMaterial color="#70756e" metalness={0.8} roughness={0.28} /></Cylinder>
    <mesh position={[0, 0.1, 0]} castShadow><torusGeometry args={[0.82, 0.055, 10, 40]} /><meshStandardMaterial color="#a3a49b" metalness={0.9} roughness={0.24} /></mesh>
    <Cylinder args={[0.72, 0.86, 0.3, 40]} position={[0, 0.22, 0]} castShadow><meshStandardMaterial color="#d5d1c0" metalness={0.62} roughness={0.3} /></Cylinder>
    <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.62, 0.7, 0.2, 40]} /><meshStandardMaterial color="#1b2120" metalness={0.88} roughness={0.23} /></mesh>
    <mesh position={[0, 0.5, 0]} castShadow><cylinderGeometry args={[0.48, 0.55, 0.08, 32]} /><meshStandardMaterial color="#686e68" metalness={0.84} roughness={0.25} /></mesh>
    <Fasteners radius={0.78} y={0.08} />
    <AxisLabel position={[0.78, 0.45, 0]} value="A1" />

    <group ref={axis2} position={[0, 0.58, 0]}>
      <RoundedBox args={[1.08, 0.78, 1]} radius={0.18} smoothness={4} position={[0, 0.35, 0]} castShadow><meshStandardMaterial color="#d9d5c4" metalness={0.58} roughness={0.29} /></RoundedBox>
      <mesh position={[0, 0.36, 0.47]}><boxGeometry args={[0.58, 0.42, 0.035]} /><meshStandardMaterial color="#a9aaa0" metalness={0.64} roughness={0.28} /></mesh>
      <mesh position={[0, 0.48, 0.5]}><boxGeometry args={[0.4, 0.035, 0.02]} /><meshStandardMaterial color="#555d56" metalness={0.72} roughness={0.3} /></mesh>
      <JointHousing radius={0.34} depth={1.04} />
      <AxisLabel position={[0.58, 0.48, 0]} value="A2" />
      <group position={[0, 0.72, 0]}>
        <RoundedBox args={[0.82, 1.34, 0.7]} radius={0.14} smoothness={4} position={[0, 0.67, 0]} castShadow><meshStandardMaterial color="#d4d0bf" metalness={0.62} roughness={0.28} /></RoundedBox>
        <RoundedBox args={[0.78, 1.08, 0.07]} radius={0.025} smoothness={2} position={[0, 0.68, 0.39]}><meshStandardMaterial color="#8b9189" metalness={0.72} roughness={0.25} /></RoundedBox>
        <mesh position={[0, 0.68, 0.43]}><boxGeometry args={[0.42, 0.025, 0.02]} /><meshStandardMaterial color="#545c55" metalness={0.7} roughness={0.3} /></mesh>
        <JointCable points={[[0.32, 0.18, 0.34], [0.39, 0.62, 0.35], [0.34, 1.05, 0.31]]} />
        <mesh position={[0, 1.34, 0]}><cylinderGeometry args={[0.31, 0.31, 0.12, 32]} /><meshStandardMaterial color="#1c2221" metalness={0.9} roughness={0.22} /></mesh>
        <Fasteners radius={0.24} count={5} y={1.41} />
        <AxisLabel position={[0.5, 0.72, 0]} value="A2" />

        <group ref={axis3} position={[0, 1.38, 0]}>
          <JointHousing radius={0.3} depth={0.86} />
          <RoundedBox args={[0.68, 1.2, 0.62]} radius={0.12} smoothness={3} position={[0, 0.58, 0]} castShadow><meshStandardMaterial color="#ccc9b9" metalness={0.62} roughness={0.3} /></RoundedBox>
          <RoundedBox args={[0.64, 0.84, 0.06]} radius={0.02} smoothness={2} position={[0, 0.57, 0.34]}><meshStandardMaterial color="#8b9189" metalness={0.74} roughness={0.25} /></RoundedBox>
          <mesh position={[0, 0.57, 0.38]}><boxGeometry args={[0.32, 0.025, 0.02]} /><meshStandardMaterial color="#545c55" metalness={0.7} roughness={0.3} /></mesh>
          <JointCable points={[[0.24, 0.16, 0.3], [0.31, 0.58, 0.3], [0.24, 0.98, 0.28]]} />
          <AxisLabel position={[0.43, 0.12, 0]} value="A3" />

          <group ref={axis4} position={[0, 1.17, 0]}>
            <JointHousing radius={0.25} depth={0.72} />
            <RoundedBox args={[0.5, 0.5, 0.46]} radius={0.09} smoothness={3} position={[0, 0.28, 0]} castShadow><meshStandardMaterial color="#d6d2c1" metalness={0.62} roughness={0.28} /></RoundedBox>
            <mesh position={[0, 0.29, 0.25]}><boxGeometry args={[0.22, 0.02, 0.02]} /><meshStandardMaterial color="#535b54" metalness={0.7} roughness={0.3} /></mesh>
            <JointCable points={[[0.19, 0.08, 0.24], [0.24, 0.25, 0.24], [0.18, 0.44, 0.22]]} />
            <AxisLabel position={[0.36, 0.28, 0]} value="A4" />
            <group ref={axis5} position={[0, 0.56, 0]}>
              <JointHousing radius={0.2} depth={0.58} />
              <RoundedBox args={[0.38, 0.42, 0.36]} radius={0.07} smoothness={3} position={[0, 0.26, 0]} castShadow><meshStandardMaterial color="#d5d1c0" metalness={0.62} roughness={0.27} /></RoundedBox>
              <AxisLabel position={[0.3, 0.28, 0]} value="A5" />
              <group ref={axis6} position={[0, 0.52, 0]}>
                <JointHousing radius={0.16} depth={0.42} />
                <mesh position={[0, 0.26, 0]} castShadow><cylinderGeometry args={[0.2, 0.17, 0.22, 24]} /><meshStandardMaterial color="#b87536" metalness={0.78} roughness={0.24} /></mesh>
                <mesh position={[0, 0.4, 0]} castShadow><cylinderGeometry args={[0.24, 0.24, 0.08, 32]} /><meshStandardMaterial color="#777c73" metalness={0.84} roughness={0.24} /></mesh>
                <Fasteners radius={0.16} count={4} y={0.44} />
                <mesh position={[0.12, 0.64, 0]} rotation={[0, 0, -0.32]} castShadow><boxGeometry args={[0.08, 0.38, 0.09]} /><meshStandardMaterial color="#d3cfbe" metalness={0.64} roughness={0.28} /></mesh>
                <mesh position={[-0.12, 0.64, 0]} rotation={[0, 0, 0.32]} castShadow><boxGeometry args={[0.08, 0.38, 0.09]} /><meshStandardMaterial color="#d3cfbe" metalness={0.64} roughness={0.28} /></mesh>
                <AxisLabel position={[0.28, 0.55, 0]} value="A6" />
                <RoundedBox args={[0.24, 0.06, 0.28]} radius={0.015} smoothness={2} position={[0, 0.76, 0]}><meshStandardMaterial color="#c27a37" metalness={0.65} roughness={0.3} /></RoundedBox>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
    <CableBundle />
    <Text position={[0.76, 0.66, 0.12]} rotation={[0, -0.18, 0]} fontSize={0.055} color="#d09a5b" anchorX="center" letterSpacing={0.04}>CAUTION</Text>
    </group>
  </group>;
}