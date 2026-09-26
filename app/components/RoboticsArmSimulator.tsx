"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import styles from "../robotics-lab/robotics-lab.module.css";

type JointValues = [number, number, number, number, number, number];

const initialJoints = [0, -25, 60, 0, 35, 0].map((degrees) => THREE.MathUtils.degToRad(degrees)) as JointValues;
const jointNames = ["Base yaw", "Shoulder", "Elbow", "Wrist roll", "Wrist pitch", "Tool roll"];
const jointRanges: Array<[number, number]> = [
  [-180, 180], [-110, 110], [-150, 150], [-180, 180], [-120, 120], [-180, 180],
];

function endEffectorPosition(joints: JointValues) {
  const transform = new THREE.Matrix4();
  const translate = (y: number) => transform.multiply(new THREE.Matrix4().makeTranslation(0, y, 0));
  const rotate = (axis: "x" | "y" | "z", angle: number) => {
    const rotation = axis === "x" ? new THREE.Vector3(1, 0, 0) : axis === "y" ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
    transform.multiply(new THREE.Matrix4().makeRotationAxis(rotation, angle));
  };

  translate(0.15);
  rotate("y", joints[0]);
  translate(0.32);
  rotate("z", joints[1]);
  translate(0.72);
  rotate("z", joints[2]);
  translate(0.62);
  rotate("y", joints[3]);
  translate(0.28);
  rotate("z", joints[4]);
  translate(0.19);
  rotate("y", joints[5]);
  translate(0.2);

  return new THREE.Vector3(0, 0, 0).applyMatrix4(transform);
}

function ArmModel({ joints, endPosition }: { joints: JointValues; endPosition: THREE.Vector3 }) {
  return <>
    <gridHelper args={[6, 24, "#716348", "#343936"]} position={[0, 0.012, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.015, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial color="#171c1b" roughness={0.94} />
    </mesh>
    <group position={[0, 0.15, 0]} rotation={[0, joints[0], 0]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.54, 0.24, 32]} />
        <meshStandardMaterial color="#77796f" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.27, 0]}>
        <torusGeometry args={[0.35, 0.035, 8, 32]} />
        <meshStandardMaterial color="#bc8045" metalness={0.72} roughness={0.32} />
      </mesh>
      <group position={[0, 0.32, 0]} rotation={[0, 0, joints[1]]}>
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[0.24, 0.7, 0.28]} />
          <meshStandardMaterial color="#c6c2b2" metalness={0.66} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.35, 0.17]}>
          <boxGeometry args={[0.1, 0.46, 0.04]} />
          <meshStandardMaterial color="#747970" metalness={0.78} roughness={0.29} />
        </mesh>
        <mesh castShadow>
          <cylinderGeometry args={[0.2, 0.2, 0.16, 24]} />
          <meshStandardMaterial color="#555c56" metalness={0.84} roughness={0.25} />
        </mesh>
        <group position={[0, 0.72, 0]} rotation={[0, 0, joints[2]]}>
          <mesh position={[0, 0.31, 0]} castShadow>
            <boxGeometry args={[0.19, 0.62, 0.22]} />
            <meshStandardMaterial color="#d4d0c0" metalness={0.68} roughness={0.28} />
          </mesh>
          <mesh castShadow>
            <cylinderGeometry args={[0.17, 0.18, 0.14, 24]} />
            <meshStandardMaterial color="#4f5651" metalness={0.82} roughness={0.27} />
          </mesh>
          <group position={[0, 0.62, 0]} rotation={[0, joints[3], 0]}>
            <mesh position={[0, 0.14, 0]} castShadow>
              <boxGeometry args={[0.15, 0.28, 0.16]} />
              <meshStandardMaterial color="#b6b7ad" metalness={0.75} roughness={0.27} />
            </mesh>
            <group position={[0, 0.28, 0]} rotation={[0, 0, joints[4]]}>
              <mesh position={[0, 0.095, 0]} castShadow>
                <cylinderGeometry args={[0.115, 0.14, 0.19, 20]} />
                <meshStandardMaterial color="#bd793c" metalness={0.75} roughness={0.27} />
              </mesh>
              <group position={[0, 0.19, 0]} rotation={[0, joints[5], 0]}>
                <mesh position={[0, 0.1, 0]} castShadow>
                  <boxGeometry args={[0.22, 0.2, 0.12]} />
                  <meshStandardMaterial color="#c9c5b5" metalness={0.7} roughness={0.28} />
                </mesh>
                <mesh position={[0.1, 0.22, 0]} rotation={[0, 0, -0.25]}>
                  <boxGeometry args={[0.045, 0.18, 0.06]} />
                  <meshStandardMaterial color="#777c72" metalness={0.72} roughness={0.29} />
                </mesh>
                <mesh position={[-0.1, 0.22, 0]} rotation={[0, 0, 0.25]}>
                  <boxGeometry args={[0.045, 0.18, 0.06]} />
                  <meshStandardMaterial color="#777c72" metalness={0.72} roughness={0.29} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
    <Line points={[[0, 0.16, 0], endPosition.toArray()]} color="#b98148" lineWidth={1} transparent opacity={0.55} />
    <mesh position={endPosition}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshStandardMaterial color="#e5aa65" emissive="#593617" emissiveIntensity={0.6} />
    </mesh>
  </>;
}

export default function RoboticsArmSimulator() {
  const [joints, setJoints] = useState<JointValues>(initialJoints);
  const [target, setTarget] = useState({ x: 0.2, y: 0.9 });
  const [ikMessage, setIkMessage] = useState("Two-link planar approximation; wrist and base yaw stay unchanged.");
  const [reducedMotion, setReducedMotion] = useState(false);
  const endPosition = endEffectorPosition(joints);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  const updateJoint = (index: number, degrees: number) => {
    setJoints((current) => current.map((value, jointIndex) => jointIndex === index ? THREE.MathUtils.degToRad(degrees) : value) as JointValues);
  };

  const solvePlanarIk = () => {
    const upperLink = 0.72;
    const lowerLink = 0.62;
    const distance = Math.hypot(target.x, target.y);
    if (distance > upperLink + lowerLink || distance < Math.abs(upperLink - lowerLink)) {
      setIkMessage("Target is outside the two-link reach. Adjust X / Y and try again.");
      return;
    }

    const elbowCosine = (distance ** 2 - upperLink ** 2 - lowerLink ** 2) / (2 * upperLink * lowerLink);
    const elbow = Math.acos(THREE.MathUtils.clamp(elbowCosine, -1, 1));
    const shoulder = Math.atan2(-target.x, target.y) - Math.atan2(lowerLink * Math.sin(elbow), upperLink + lowerLink * Math.cos(elbow));
    setJoints((current) => current.map((value, index) => index === 1 ? shoulder : index === 2 ? elbow : value) as JointValues);
    setIkMessage("Planar solution applied to shoulder and elbow only.");
  };

  return <div className={styles.armWorkspace}>
    <div className={styles.armViewport}>
      <Canvas camera={{ position: [3.2, 2.8, 4.2], fov: 38, near: 0.1, far: 30 }} dpr={[1, 1.35]} frameloop="demand" fallback={<p>3D preview is not available in this browser.</p>}>
        <color attach="background" args={["#121615"]} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[3.5, 5, 4]} intensity={2.2} color="#f3dfc0" />
        <pointLight position={[-2.5, 2.4, -1]} intensity={12} distance={8} color="#a66e37" />
        <ArmModel joints={joints} endPosition={endPosition} />
        <OrbitControls makeDefault enableDamping={!reducedMotion} enablePan={false} minDistance={2.4} maxDistance={7} maxPolarAngle={Math.PI * 0.82} />
      </Canvas>
      <div className={styles.viewportLabel}><span>6R / KINEMATIC CHAIN</span><span>DRAG TO ORBIT</span></div>
    </div>

    <div className={styles.armReadout}>
      <div className={styles.readoutHead}><span>FORWARD KINEMATICS</span><span>BASE FRAME / m</span></div>
      <div className={styles.positionValues}>
        {(["X", "Y", "Z"] as const).map((axis, index) => <div key={axis}><span>{axis}</span><output>{endPosition.getComponent(index).toFixed(3)}</output></div>)}
      </div>
      <p>Position from the current joint-angle chain. Orientation is not solved.</p>
    </div>

    <div className={styles.jointPanel}>
      <div className={styles.panelTitle}><h3>Joint controls</h3><button type="button" className={styles.quietButton} onClick={() => { setJoints(initialJoints); setIkMessage("Joint pose reset to the starting configuration."); }}>RESET POSE</button></div>
      <div className={styles.jointGrid}>
        {jointNames.map((name, index) => {
          const degrees = Math.round(THREE.MathUtils.radToDeg(joints[index]));
          const [minimum, maximum] = jointRanges[index];
          return <label className={styles.jointControl} key={name}>
            <span><span>{String(index + 1).padStart(2, "0")} / {name}</span><output>{degrees}°</output></span>
            <input type="range" min={minimum} max={maximum} step="1" value={degrees} aria-label={`${name} joint angle in degrees`} onChange={(event) => updateJoint(index, event.currentTarget.valueAsNumber)} />
          </label>;
        })}
      </div>
    </div>

    <div className={styles.ikPanel}>
      <div className={styles.ikCopy}><p className={styles.kicker}>IK / CONCEPT UNDER DEVELOPMENT</p><h3>Choose a planar target</h3><p>A two-link geometric example adjusts shoulder and elbow angles. It does not solve full six-axis pose or collision constraints.</p></div>
      <div className={styles.ikControls}>
        <label>X <span>m</span><input type="number" min="-1.3" max="1.3" step="0.05" value={target.x} onChange={(event) => { const value = event.currentTarget.valueAsNumber; setTarget((current) => ({ ...current, x: Number.isFinite(value) ? value : 0 })); }} /></label>
        <label>Y <span>m</span><input type="number" min="-1.3" max="1.3" step="0.05" value={target.y} onChange={(event) => { const value = event.currentTarget.valueAsNumber; setTarget((current) => ({ ...current, y: Number.isFinite(value) ? value : 0 })); }} /></label>
        <button type="button" className={styles.solveButton} onClick={solvePlanarIk}>APPLY 2-LINK SOLUTION <span aria-hidden="true">↗</span></button>
        <p className={styles.ikMessage} aria-live="polite">{ikMessage}</p>
      </div>
    </div>
  </div>;
}