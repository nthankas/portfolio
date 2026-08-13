/**
 * Experience entries, reverse chronological.
 *
 * Both employer entries are written to the proprietary discipline in the build
 * brief: domain and responsibility only, no internal names, no line specifics.
 * Wording for both was dictated by the owner and is confirmed.
 */

export interface Role {
  org: string;
  title: string;
  location: string;
  dates: string;
  /** One dense paragraph, written as contribution rather than duties. */
  body: string;
  stack: string[];
  status: 'confirmed' | 'needs_confirmation';
  openQuestions: string[];
}

export const experience: Role[] = [
  {
    org: 'Charge Robotics',
    title: 'Robotics Software Engineering Intern',
    location: 'San Leandro, CA',
    dates: 'June 2026 to present',
    body: 'I am one of five software engineers on a multi-arm autonomous solar installation robot, in charge of the software stack including the end-to-end safety and monitoring system, from the safety controller up through the operator interface. The work spans controls and real-time device communication, networking and distributed communication across the robotic stack, and sensor fusion for proximity awareness, including distance sensing integrated over IO-Link so the system keeps real-time awareness during autonomous operation. I integrated brushless DC motor firmware for a custom screwdriver end-effector, and I am helping design and bring up the software for a new system the company has created.',
    stack: ['Software stack ownership', 'Safety systems', 'Controls', 'Real-time comms', 'Sensor fusion', 'Bring-up'],
    status: 'confirmed',
    openQuestions: [],
  },
  {
    org: 'Ambi Robotics',
    title: 'Robotics Intern',
    location: 'Berkeley, CA',
    dates: 'Fall 2025 to June 2026',
    body: 'I worked across two autonomous manipulation platforms, one for parcel sorting and one for palletizing, tracing perception, grasp-planning and motion-control faults to root cause through state-machine control pipelines. The palletizing system, a gantry that stacks arbitrary items onto pallets and containers with no prior knowledge of the items, stacks with a neural network policy trained for the task, and I helped test and improve that policy over my time there. I isolated failures spanning the perception and control stack using neural network inference logs, 3D visualizations and system telemetry, analyzed production run data in a time-series robotics visualization tool including point cloud and segmentation mask inspection, and worked with promptable segmentation on a live camera feed to estimate item footprint in real time, including the open problem of prompt stability across item categories. I also supported the team container and version-control infrastructure.',
    stack: [
      'Neural policy testing',
      'Perception debugging',
      'Point clouds',
      'Promptable segmentation',
      'Telemetry analysis',
    ],
    status: 'confirmed',
    openQuestions: [],
  },
  {
    org: 'UC Santa Cruz',
    title: 'Group Tutor',
    location: 'Santa Cruz, CA',
    dates: 'Fall 2025',
    body: 'I led lab sections for Computer Systems and C Programming, and for Introduction to Robotics. I taught embedded C and taught MATLAB for dynamic systems analysis.',
    stack: ['Embedded C', 'MATLAB'],
    status: 'confirmed',
    openQuestions: [],
  },
];

export const education = [
  {
    degree: 'M.S. Electrical and Computer Engineering',
    detail: 'Robotics, Controls, and Cyber-Physical Systems track',
    org: 'UC Santa Cruz',
    dates: 'In progress, expected June 2027',
  },
  {
    degree: 'B.S. Robotics Engineering',
    detail: 'Minor in Electrical Engineering',
    org: 'UC Santa Cruz',
    dates: 'June 2026',
  },
];
