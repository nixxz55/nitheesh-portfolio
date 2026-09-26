export const roverParts = [
  { id: "chassis", label: "CHASSIS", name: "Waterproof Chassis", description: "Sealed enclosure for the rover's onboard components." },
  { id: "drive", label: "DRIVE SYSTEM", name: "Drive System", description: "Provides rover movement inside the pipeline." },
  { id: "camera", label: "CAMERA", name: "Inspection Camera", description: "Used for inner-wall visual inspection." },
  { id: "sensor", label: "INSPECTION SENSOR", name: "Inspection Sensor", description: "Used for pipe-wall scanning." },
  { id: "imu", label: "IMU / MOTION SENSOR", name: "Motion Sensor", description: "Provides rover orientation and motion sensing." },
  { id: "controller", label: "ONBOARD COMPUTER", name: "Onboard Controller", description: "Processes sensor and inspection data." },
  { id: "battery", label: "BATTERY", name: "Power System", description: "Provides electrical power to onboard systems." },
  { id: "communication", label: "COMMUNICATION", name: "Communication Module", description: "Transfers rover data to the control system." },
] as const;

export type RoverPart = typeof roverParts[number]["id"];