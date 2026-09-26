"use client";

import { useState } from "react";
import * as THREE from "three";
import styles from "../robotics-lab/robotics-lab.module.css";

type PoseValues = { x: number; y: number; z: number; roll: number; pitch: number; yaw: number };
type DhValues = { theta: number; d: number; a: number; alpha: number };

function formatValue(value: number, digits = 3) {
  return Number.isFinite(value) ? (Object.is(value, -0) ? 0 : value).toFixed(digits) : "-";
}

function matrixRows(matrix: THREE.Matrix4) {
  return Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, column) => matrix.elements[column * 4 + row]));
}

function MatrixTable({ rows }: { rows: number[][] }) {
  return <div className={styles.matrixWrap}><table className={styles.matrixTable} aria-label="4 by 4 transformation matrix"><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((value, columnIndex) => <td key={columnIndex}>{formatValue(value, 3)}</td>)}</tr>)}</tbody></table></div>;
}

function NumberField({ label, value, unit, onChange, step = "0.1" }: { label: string; value: number; unit?: string; onChange: (value: number) => void; step?: string }) {
  return <label className={styles.numberField}>
    <span>{label}{unit && <small>{unit}</small>}</span>
    <input type="number" step={step} value={value} onChange={(event) => onChange(Number.isFinite(event.currentTarget.valueAsNumber) ? event.currentTarget.valueAsNumber : 0)} aria-label={`${label}${unit ? ` in ${unit}` : ""}`} />
  </label>;
}

export default function RoboticsCalculators() {
  const [degrees, setDegrees] = useState("90");
  const [radians, setRadians] = useState((Math.PI / 2).toFixed(5));
  const [rpm, setRpm] = useState(60);
  const [pose, setPose] = useState<PoseValues>({ x: 0.25, y: 0.1, z: 0.4, roll: 0, pitch: 0, yaw: 30 });
  const [dh, setDh] = useState<DhValues>({ theta: 35, d: 0.2, a: 0.45, alpha: 90 });

  const rotation = new THREE.Euler(
    THREE.MathUtils.degToRad(pose.roll),
    THREE.MathUtils.degToRad(pose.pitch),
    THREE.MathUtils.degToRad(pose.yaw),
    "XYZ",
  );
  const poseMatrix = new THREE.Matrix4().compose(
    new THREE.Vector3(pose.x, pose.y, pose.z),
    new THREE.Quaternion().setFromEuler(rotation),
    new THREE.Vector3(1, 1, 1),
  );

  const theta = THREE.MathUtils.degToRad(dh.theta);
  const alpha = THREE.MathUtils.degToRad(dh.alpha);
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  const cosAlpha = Math.cos(alpha);
  const sinAlpha = Math.sin(alpha);
  const dhRows = [
    [cosTheta, -sinTheta * cosAlpha, sinTheta * sinAlpha, dh.a * cosTheta],
    [sinTheta, cosTheta * cosAlpha, -cosTheta * sinAlpha, dh.a * sinTheta],
    [0, sinAlpha, cosAlpha, dh.d],
    [0, 0, 0, 1],
  ];

  const updatePose = (key: keyof PoseValues, value: number) => setPose((current) => ({ ...current, [key]: value }));
  const updateDh = (key: keyof DhValues, value: number) => setDh((current) => ({ ...current, [key]: value }));

  return <>
    <div className={styles.calculatorGrid}>
      <section className={`${styles.calculatorCard} ${styles.unitCard}`} aria-labelledby="units-title">
        <div className={styles.calculatorHeading}><span>01 / ANGULAR UNITS</span><h3 id="units-title">Degrees ↔ radians</h3></div>
        <div className={styles.unitPair}>
          <label className={styles.unitInput}><span>DEGREES</span><input type="number" step="any" value={degrees} onChange={(event) => {
            const value = event.currentTarget.value;
            setDegrees(value);
            setRadians(value.trim() && Number.isFinite(Number(value)) ? (Number(value) * Math.PI / 180).toFixed(5) : "");
          }} aria-label="Angle in degrees" /></label>
          <span className={styles.conversionArrow} aria-hidden="true">↔</span>
          <label className={styles.unitInput}><span>RADIANS</span><input type="number" step="any" value={radians} onChange={(event) => {
            const value = event.currentTarget.value;
            setRadians(value);
            setDegrees(value.trim() && Number.isFinite(Number(value)) ? (Number(value) * 180 / Math.PI).toFixed(3) : "");
          }} aria-label="Angle in radians" /></label>
        </div>
        <p className={styles.calculatorHint}>1 rad = 180 / pi degrees</p>
      </section>

      <section className={`${styles.calculatorCard} ${styles.rpmCard}`} aria-labelledby="rpm-title">
        <div className={styles.calculatorHeading}><span>02 / ROTATIONAL SPEED</span><h3 id="rpm-title">RPM → rad/s</h3></div>
        <label className={styles.numberField}><span>ROTATIONAL SPEED<small>rpm</small></span><input type="number" step="any" value={rpm} onChange={(event) => setRpm(Number.isFinite(event.currentTarget.valueAsNumber) ? event.currentTarget.valueAsNumber : 0)} aria-label="Rotational speed in RPM" /></label>
        <div className={styles.resultReadout}><span>ANGULAR VELOCITY</span><output>{formatValue(rpm * Math.PI * 2 / 60, 4)} <small>rad/s</small></output></div>
        <p className={styles.calculatorHint}>rad/s = rpm x 2 pi / 60</p>
      </section>

      <section className={`${styles.calculatorCard} ${styles.matrixCard}`} aria-labelledby="transform-title">
        <div className={styles.calculatorHeading}><span>03 / RIGID-BODY POSE</span><h3 id="transform-title">Transformation matrix</h3></div>
        <p className={styles.cardDescription}>Translation in metres; roll, pitch, and yaw in degrees. Rotation order: XYZ.</p>
        <div className={styles.fieldGrid}>
          <NumberField label="X" unit="m" value={pose.x} onChange={(value) => updatePose("x", value)} />
          <NumberField label="Y" unit="m" value={pose.y} onChange={(value) => updatePose("y", value)} />
          <NumberField label="Z" unit="m" value={pose.z} onChange={(value) => updatePose("z", value)} />
          <NumberField label="Roll" unit="deg" value={pose.roll} onChange={(value) => updatePose("roll", value)} />
          <NumberField label="Pitch" unit="deg" value={pose.pitch} onChange={(value) => updatePose("pitch", value)} />
          <NumberField label="Yaw" unit="deg" value={pose.yaw} onChange={(value) => updatePose("yaw", value)} />
        </div>
        <MatrixTable rows={matrixRows(poseMatrix)} />
      </section>

      <section className={`${styles.calculatorCard} ${styles.dhCard}`} aria-labelledby="dh-title">
        <div className={styles.calculatorHeading}><span>04 / LINK CONVENTION</span><h3 id="dh-title">DH transform</h3></div>
        <p className={styles.cardDescription}>One standard Denavit-Hartenberg transform. Distances in metres; angles in degrees.</p>
        <div className={styles.dhFields}>
          <NumberField label="theta" unit="deg" value={dh.theta} onChange={(value) => updateDh("theta", value)} />
          <NumberField label="d" unit="m" value={dh.d} onChange={(value) => updateDh("d", value)} />
          <NumberField label="a" unit="m" value={dh.a} onChange={(value) => updateDh("a", value)} />
          <NumberField label="alpha" unit="deg" value={dh.alpha} onChange={(value) => updateDh("alpha", value)} />
        </div>
        <MatrixTable rows={dhRows} />
      </section>
    </div>
    <aside className={styles.fkNote}>
      <span>FK / CHAIN COMPOSITION</span>
      <p>Start with the base frame, then multiply each joint and link transform in order. The arm simulator above applies this idea to a simplified six-joint chain.</p>
      <code>T06 = T01 x T12 x T23 x T34 x T45 x T56</code>
    </aside>
  </>;
}