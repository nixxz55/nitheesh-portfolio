"use client";

import Link from "next/link";
import styles from "../robotics-lab/robotics-lab.module.css";
import RoboticsArmSimulator from "./RoboticsArmSimulator";
import RoboticsCalculators from "./RoboticsCalculators";

const rosTopics = [
  { title: "Nodes", detail: "Processes that perform focused work inside a ROS 2 system." },
  { title: "Topics", detail: "Publish/subscribe communication for streams of messages." },
  { title: "Services", detail: "Request/response communication for short operations." },
  { title: "Actions", detail: "Long-running goals with feedback and cancellation." },
  { title: "TF", detail: "Coordinate frames and relationships over time." },
  { title: "Nav2", detail: "Navigation concepts, planning, and robot behavior." },
  { title: "SLAM", detail: "Learning how mapping and localization fit together." },
];

const visionTopics = [
  { index: "01", title: "Camera foundations", detail: "Exploring image formation, field of view, and calibration concepts." },
  { index: "02", title: "Color detection", detail: "Learning HSV thresholds, masks, and their lighting limitations." },
  { index: "03", title: "Object detection", detail: "Studying the stages and trade-offs in a detection pipeline." },
  { index: "04", title: "OpenCV", detail: "Currently studying image operations, contours, and camera input." },
];

const notebookEntries = [
  { label: "LEARNING", title: "ROS 2 communication", detail: "Study how nodes exchange data through topics, services, and actions." },
  { label: "EXPERIMENT TO TRY", title: "Tune a color mask", detail: "Vary HSV bounds under different lighting and note where the mask breaks down." },
  { label: "QUESTION", title: "Coordinate frames", detail: "When does a transform belong in the robot description, and when is it time-varying?" },
  { label: "WORKING UNDERSTANDING", title: "Kinematic chains", detail: "Each joint transform contributes to the final end-effector pose; order matters." },
  { label: "NEXT TO STUDY", title: "Differential kinematics", detail: "Connect small joint changes to end-effector velocity through a Jacobian." },
];

export default function RoboticsLabExperience() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Return to Nitheesh's main portfolio">
          <span className={styles.brandMark}>NK</span>
          <span>NITHEESH / ROBOTICS LAB</span>
        </Link>
        <nav className={styles.headerNav} aria-label="Robotics Lab sections">
          <a href="#ros-2">ROS 2</a>
          <a href="#arm-lab">ARM LAB</a>
          <a href="#vision-lab">VISION</a>
          <a href="#calculators">TOOLS</a>
          <a href="#notebook">NOTES</a>
        </nav>
        <Link className={styles.returnLink} href="/">MAIN PORTFOLIO <span aria-hidden="true">↗</span></Link>
      </header>

      <section className={styles.hero} aria-labelledby="lab-title">
        <div className={styles.heroCopy}>
          <p className={styles.kicker}><span className={styles.liveDot} /> PERSONAL R&amp;D / LEARNING IN PROGRESS</p>
          <h1 id="lab-title">Nitheesh<br /><span>Robotics Lab</span></h1>
          <p className={styles.heroSummary}>A working space for studying how robots sense, move, and communicate. Concepts here are being learned and explored, not presented as professional expertise.</p>
          <a className={styles.textLink} href="#arm-lab">OPEN THE ARM SIMULATOR <span aria-hidden="true">↓</span></a>
        </div>
        <div className={styles.heroReadout} aria-label="Current learning areas">
          <p className={styles.readoutLabel}>STUDY AREAS</p>
          <div><span>01</span> ROS 2 systems</div>
          <div><span>02</span> Manipulator kinematics</div>
          <div><span>03</span> Computer vision</div>
          <div className={styles.readoutFoot}>MODE <b>LEARN / EXPLORE / TEST</b></div>
        </div>
        <div className={styles.heroRule} aria-hidden="true" />
      </section>

      <section className={`${styles.section} ${styles.rosSection}`} id="ros-2" aria-labelledby="ros-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>01 / MIDDLEWARE STUDY</p>
          <h2 id="ros-title">ROS 2 <span>Lab</span></h2>
          <p>Currently learning the building blocks of a ROS 2 system, from message flow to robot navigation.</p>
        </div>
        <div className={styles.topicGrid}>
          {rosTopics.map((topic, index) => (
            <article className={styles.topic} key={topic.title}>
              <span className={styles.topicIndex}>{String(index + 1).padStart(2, "0")}</span>
              <h3>{topic.title}</h3>
              <p>{topic.detail}</p>
              <span className={styles.topicStatus}>LEARNING</span>
            </article>
          ))}
          <article className={`${styles.topic} ${styles.jalrakshakCard}`}>
            <span className={styles.topicIndex}>08</span>
            <span className={styles.fieldTag}>FIELD SYSTEM</span>
            <h3>JalRakshak</h3>
            <p className={styles.fieldSubhead}>UNDERGROUND PIPELINE<br />INSPECTION</p>
            <p className={styles.fieldDetail}>A ROS 2 based robotic<br />inspection concept for<br />detecting and locating<br />pipeline abnormalities.</p>
            <Link className={styles.topicAction} href="/jalrakshak">OPEN TO EXPLORE <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.armSection}`} id="arm-lab" aria-labelledby="arm-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>02 / MANIPULATOR STUDY</p>
          <h2 id="arm-title">Robot arm <span>lab</span></h2>
          <p>Adjust six revolute joints and observe a simplified forward-kinematics chain. This is an educational visualization, not a calibrated robot model.</p>
        </div>
        <RoboticsArmSimulator />
      </section>

      <section className={`${styles.section} ${styles.visionSection}`} id="vision-lab" aria-labelledby="vision-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>03 / PERCEPTION STUDY</p>
          <h2 id="vision-title">Vision <span>lab</span></h2>
          <p>A learning track for camera input and image processing. No completed AI or computer-vision projects are claimed here.</p>
        </div>
        <div className={styles.visionGrid}>
          {visionTopics.map((topic) => (
            <article className={styles.visionTopic} key={topic.index}>
              <span>{topic.index} / STUDY TRACK</span>
              <h3>{topic.title}</h3>
              <p>{topic.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.toolsSection}`} id="calculators" aria-labelledby="tools-title">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>04 / QUICK ENGINEERING TOOLS</p>
          <h2 id="tools-title">Robotics <span>calculator</span></h2>
          <p>Small, editable calculations for checking units and inspecting common rigid-body transforms.</p>
        </div>
        <RoboticsCalculators />
      </section>

      <section className={`${styles.section} ${styles.notebookSection}`} id="notebook" aria-labelledby="notebook-title">
        <div className={styles.notebookIntro}>
          <p className={styles.kicker}>05 / ENGINEERING LEARNING LOG</p>
          <h2 id="notebook-title">R&amp;D <span>notebook</span></h2>
          <p>Study prompts and current working notes. These describe learning in progress, not completed project outcomes.</p>
        </div>
        <div className={styles.notebookList}>
          {notebookEntries.map((entry, index) => (
            <article className={styles.notebookEntry} key={entry.label}>
              <span className={styles.notebookNumber}>{String(index + 1).padStart(2, "0")}</span>
              <div><p>{entry.label}</p><h3>{entry.title}</h3><span>{entry.detail}</span></div>
              <span className={styles.entryMark} aria-hidden="true">+</span>
            </article>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.footerBrand}>NK / R&amp;D</Link>
        <span>LEARNING IN PROGRESS / NITHEESH K</span>
        <a href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>BACK TO TOP ↑</a>
      </footer>
    </main>
  );
}