import type { Metadata } from "next";
import JalRakshakExperience from "../components/jalrakshak/JalRakshakExperience";

export const metadata: Metadata = {
  title: "JalRakshak | Pipeline Inspection Simulation",
  description: "A student robotics simulation concept for exploring underground pipeline inspection with ROS 2 and a mobile robot.",
};

export default function JalRakshakPage() {
  return <JalRakshakExperience />;
}