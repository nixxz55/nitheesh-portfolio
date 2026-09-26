import Link from "next/link";
import styles from "../../jalrakshak/jalrakshak.module.css";

export type CameraMode = "overview" | "robot" | "detection" | "roverSystem";

const cameraModes: Array<{ id: CameraMode; label: string }> = [
  { id: "overview", label: "OVERVIEW" },
  { id: "robot", label: "ROBOT" },
  { id: "detection", label: "DETECTION" },
  { id: "roverSystem", label: "ROVER SYSTEM" },
];

export default function InspectionControls({ cameraMode, onChangeMode, onSelectDetection }: { cameraMode: CameraMode; onChangeMode: (mode: CameraMode) => void; onSelectDetection: () => void }) {
  return (
    <nav className={styles.controls} aria-label="Inspection camera controls">
      <div className={styles.modeControls}>
        {cameraModes.map((mode) => (
          <button
            className={cameraMode === mode.id ? styles.activeMode : ""}
            key={mode.id}
            type="button"
            data-mode={mode.id}
            aria-pressed={cameraMode === mode.id}
            aria-label={mode.label}
            onClick={() => mode.id === "detection" ? onSelectDetection() : onChangeMode(mode.id)}
          >
            {mode.id === "roverSystem" ? <>ROVER <span className={styles.roverModeSecond}>SYSTEM</span></> : mode.label}
          </button>
        ))}
      </div>
      <Link className={styles.backLink} href="/">BACK TO PORTFOLIO <span aria-hidden="true">↗</span></Link>
    </nav>
  );
}