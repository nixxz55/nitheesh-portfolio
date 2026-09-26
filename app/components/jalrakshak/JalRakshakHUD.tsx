import type { CameraMode } from "./InspectionControls";
import styles from "../../jalrakshak/jalrakshak.module.css";
import { roverParts } from "./RoverParts";
import type { RoverPart } from "./RoverParts";

export default function JalRakshakHUD({ cameraMode, detectionActive, introVisible, selectedRoverPart, onSelectRoverPart }: { cameraMode: CameraMode; detectionActive: boolean; introVisible: boolean; selectedRoverPart: RoverPart | null; onSelectRoverPart: (part: RoverPart) => void }) {
  const selectedInfo = roverParts.find((part) => part.id === selectedRoverPart);
  const cameraLabels: Record<CameraMode, string> = { overview: "OVERVIEW", robot: "ROBOT", detection: "DETECTION", roverSystem: "ROVER SYSTEM" };

  return (
    <>
      <header className={styles.topBar}>
        <div className={styles.wordmark}><span>JR / 01</span><span>JALRAKSHAK</span></div>
        <span className={styles.simulationTag}><i /> STUDENT SIMULATION / CONCEPT</span>
      </header>

      <section className={`${styles.titleIntro} ${detectionActive ? styles.titleHiddenNow : introVisible ? styles.titleVisible : styles.titleDismissed}`} aria-label="JalRakshak title">
        <p>JALRAKSHAK</p>
        <h1>UNDERGROUND PIPELINE<br />INSPECTION SYSTEM</h1>
        <span>ROS 2 <b>•</b> ROBOTICS <b>•</b> SIMULATION</span>
      </section>

      <aside className={styles.statusPanel} aria-label="Simulated inspection status">
        <p className={styles.panelEyebrow}>SIMULATION TELEMETRY</p>
        <div className={styles.statusRow}><span>PIPE PRESSURE</span><b>5.00 <small>bar</small></b></div>
        <div className={styles.statusRow}><span>CAMERA</span><b><i /> ONLINE</b></div>
        <div className={styles.statusRow}><span>ROBOT STATUS</span><b className={styles.inspecting}>INSPECTING</b></div>
        <div className={styles.statusRow}><span>INSPECTION DISTANCE</span><b>100 <small>m</small></b></div>
        <div className={styles.routeScale} aria-label="Simulation distance markers">
          {["0 m", "50 m", "100 m", "150 m"].map((marker) => <span key={marker}>{marker}</span>)}
          <i aria-hidden="true" />
        </div>
        <p className={styles.simulationNote}>SIMULATED VALUES / NOT FIELD MEASUREMENTS</p>
      </aside>

      {cameraMode === "roverSystem" && (
        <section className={styles.roverSystemPanel} aria-labelledby="rover-system-title">
          <p className={styles.panelEyebrow}>ROVER SYSTEM / COMPONENT INSPECTION</p>
          <h2 id="rover-system-title">ROVER ASSEMBLIES</h2>
          <div className={styles.roverPartGrid} role="group" aria-label="Rover components">
            {roverParts.map((part) => (
              <button key={part.id} type="button" aria-pressed={selectedRoverPart === part.id} className={selectedRoverPart === part.id ? styles.activeRoverPart : ""} onClick={() => onSelectRoverPart(part.id)}>
                {part.label}
              </button>
            ))}
          </div>
          {selectedInfo && <div className={styles.roverPartDescription} aria-live="polite"><h3>{selectedInfo.name}</h3><p>{selectedInfo.description}</p></div>}
        </section>
      )}

      {detectionActive && cameraMode !== "roverSystem" && (
        <section className={styles.detectionPanel} aria-live="polite" aria-labelledby="detection-title">
          <p className={styles.detectionEyebrow}><i /> SIMULATION / INNER-WALL INSPECTION</p>
          <h2 id="detection-title">ABNORMALITY DETECTED</h2>
          <p className={styles.detectionName}>JALRAKSHAK / PIPE INSPECTION</p>
          <dl>
            <div><dt>DEFECT</dt><dd>STRUCTURAL CRACK</dd></div>
            <div><dt>LEAK</dt><dd>LEAK DETECTED</dd></div>
            <div><dt>LOCATION</dt><dd>SIMULATION</dd></div>
            <div><dt>PRESSURE</dt><dd>5.00 bar <span>SIMULATED</span></dd></div>
            <div><dt>CAMERA</dt><dd>ONLINE</dd></div>
          </dl>
          <p className={styles.detectionCaveat}>Concept visualization only. No real-world detection accuracy is claimed.</p>
        </section>
      )}

      <div className={styles.sceneReadout} aria-hidden="true"><span>CAM / {cameraLabels[cameraMode]}</span><span>ROUTE / 0—150 m</span></div>
    </>
  );
}