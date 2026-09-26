import type { Metadata } from "next";
import RoboticsLabExperience from "../components/RoboticsLabExperience";

export const metadata: Metadata = {
  title: "Robotics Lab | Nitheesh K",
  description: "A robotics learning workspace for exploring ROS 2, robot kinematics, computer vision, and engineering notes.",
};

export default function RoboticsLabPage() {
  return <RoboticsLabExperience />;
}