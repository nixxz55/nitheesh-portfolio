"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { CameraRig, LabEnvironment, RobotArm } from "./components/RoboticsLab";
import type { Station } from "./components/RoboticsLab";

const stations: Array<{ id: Station; label: string; code: string }> = [
  { id: "arrival", label: "Arrival", code: "00" },
  { id: "about", label: "Operator console", code: "01" },
  { id: "focus", label: "Engineering desk", code: "02" },
  { id: "work", label: "Inspection bench", code: "03" },
  { id: "contact", label: "Comms terminal", code: "04" },
  { id: "overview", label: "Overview", code: "05" },
];

const GITHUB_URL = "https://github.com/nixxz55";
const LINKEDIN_URL = "https://www.linkedin.com/in/nitheesh-k-58079b380?utm_source=share_via&utm_content=profile&utm_medium=member_android";
const EMAIL_ADDRESS = "nixxz2006@gmail.com";
const PHONE_NUMBER = "7904100170";

const contactLinks = [
  { label: "GitHub", href: GITHUB_URL, external: true },
  { label: "LinkedIn", href: LINKEDIN_URL, external: true },
  { label: "Email", href: `mailto:${EMAIL_ADDRESS}`, external: false },
  { label: "Mobile", href: `tel:${PHONE_NUMBER}`, external: false },
];

const stationContent: Record<Station, { eyebrow: string; title: string; body: string; meta: string }> = {
  arrival: { eyebrow: "R&D WORKSPACE / 00", title: "Nitheesh K", body: "Robotics & Automation Engineering Student", meta: "Scroll to explore  /  Select a station" },
  about: { eyebrow: "OPERATOR CONSOLE / 01", title: "Nitheesh K", body: "3rd Year B.E. Robotics & Automation Engineering\nErode Sengunthar Engineering College", meta: "Career interest: Robotics R&D" },
  focus: { eyebrow: "CURRENT FOCUS / 02", title: "Learning in motion", body: "ROS 2  /  Robotics & Automation  /  Robot Simulation\nLinux  /  Computer Vision  /  AI / ML exploration", meta: "Learning / Exploring / Interested in" },
  work: { eyebrow: "WORK & LEARNING / 03", title: "Building the foundation", body: "Currently building my foundation in robotics and automation.\nExploring ROS 2, robot simulation, computer vision and robotics R&D.", meta: "Hands-on learning and experimentation" },
  contact: { eyebrow: "COMMUNICATION TERMINAL / 04", title: "Open channel", body: "GitHub\nLinkedIn\nEmail\nMobile", meta: "Secure contact terminal / Nitheesh K" },
  overview: { eyebrow: "LAB OVERVIEW / 05", title: "A workbench for curiosity", body: "A compact robotics R&D workspace for learning, testing ideas and documenting the next step.", meta: "Nitheesh K  /  Robotics R&D" },
};

export default function Home() {
  const [station, setStation] = useState<Station>("arrival");
  const [isReady, setIsReady] = useState(false);
  const touchStart = useRef<number | null>(null);
  const moveStation = useCallback((direction: 1 | -1) => {
    setStation((currentStation) => {
      const currentIndex = stations.findIndex((item) => item.id === currentStation);
      return stations[Math.max(0, Math.min(stations.length - 1, currentIndex + direction))].id;
    });
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => { if (Math.abs(event.deltaY) >= 12) moveStation(event.deltaY > 0 ? 1 : -1); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "ArrowDown" || event.key === "PageDown") moveStation(1); if (event.key === "ArrowUp" || event.key === "PageUp") moveStation(-1); };
    const onHash = () => {
      const hash = window.location.hash.slice(1) as Station;
      if (!stations.some((item) => item.id === hash)) return;
      setStation((currentStation) => currentStation === hash ? currentStation : hash);
    };
    window.addEventListener("wheel", onWheel, { passive: true }); window.addEventListener("keydown", onKeyDown); window.addEventListener("hashchange", onHash); onHash();
    const timer = window.setTimeout(() => setIsReady(true), 450);
    return () => { window.removeEventListener("wheel", onWheel); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("hashchange", onHash); window.clearTimeout(timer); };
  }, [moveStation]);

  useEffect(() => {
    const nextHash = `#${station}`;
    if (window.location.hash !== nextHash) window.history.replaceState(null, "", nextHash);
  }, [station]);

  return <main className="lab-shell" onTouchStart={(event) => { touchStart.current = event.touches[0].clientY; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const delta = touchStart.current - event.changedTouches[0].clientY; if (Math.abs(delta) > 36) moveStation(delta > 0 ? 1 : -1); touchStart.current = null; }}>
    <div className="scene-frame" aria-hidden="true"><Canvas shadows dpr={[1, 1.6]} camera={{ position: [7.8, 6.6, 8.2], fov: 50, near: 0.1, far: 40 }} fallback={null} onCreated={() => setIsReady(true)}><color attach="background" args={["#101315"]} /><fog attach="fog" args={["#101315", 12, 27]} /><ambientLight intensity={0.55} /><directionalLight castShadow position={[4, 9, 3]} intensity={2.2} color="#fff0d4" shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} /><spotLight position={[0, 7.5, 1]} angle={0.48} penumbra={0.72} intensity={45} distance={14} color="#f4dfb9" castShadow /><pointLight position={[-4, 5, 1]} intensity={16} distance={10} color="#da8c3d" /><Environment preset="warehouse" /><CameraRig station={station} /><LabEnvironment station={station} /><RobotArm station={station} /><ContactShadows position={[0, 0.02, 0]} opacity={0.48} scale={16} blur={2.6} far={8} /></Canvas></div>
    <header className="lab-header"><span className="brand-mark">NK / R&amp;D</span><span className="status"><i /> SYSTEM ONLINE</span><span className="header-note">ROBOTICS &amp; AUTOMATION / 2026</span></header>
    <nav className="station-nav" aria-label="Laboratory stations"><span className="nav-caption">STATIONS</span>{stations.map((item) => <button key={item.id} className={item.id === station ? "active" : ""} onClick={() => setStation(item.id)} aria-label={`Go to ${item.label}`} aria-current={item.id === station ? "step" : undefined}><span>{item.code}</span>{item.label}</button>)}</nav>
    <section className={`station-copy ${isReady ? "is-ready" : ""}`} aria-live="polite"><p className="eyebrow">{stationContent[station].eyebrow}</p><h1>{stationContent[station].title}</h1><p className="body-copy">{stationContent[station].body}</p>{station === "contact" && <div className="contact-links" aria-label="Contact links">{contactLinks.map((link) => <a key={link.label} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined}>{link.label}<span aria-hidden="true">↗</span></a>)}</div>}<p className="meta-copy">{stationContent[station].meta}</p></section>
    <div className="corner-readout"><span>08.00 X 07.00 M</span><span>NO DIGITAL TWIN CLAIM</span></div><div className="scroll-cue"><span className="scroll-line" /><span>SCROLL / SWIPE</span></div>
  </main>;
}