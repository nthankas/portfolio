/**
 * Skills, grouped by domain.
 *
 * Every entry here appears in work described elsewhere on this site. Nothing is
 * listed that does not trace to a project, a role, or the live repository pull.
 */

export interface SkillGroup {
  name: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    name: 'Robotics middleware and simulation',
    items: [
      'ROS 2 Humble',
      'NVIDIA Isaac Sim / PhysX',
      'ros2_control',
      'MoveIt 2',
      'URDF / xacro',
      'RViz, Foxglove',
      'Monte Carlo design studies',
    ],
  },
  {
    name: 'Embedded and real-time',
    items: [
      'Embedded C',
      'PIC32',
      'Teensy 4.1 / Cortex-M7',
      'STM32',
      'CAN bus',
      'I2C, SPI, UART',
      'Timer and interrupt capture',
      'Closed-loop stepper and BLDC control',
      'Event-driven state machines',
    ],
  },
  {
    name: 'Perception and estimation',
    items: [
      'RGBD visual odometry',
      'Extended Kalman Filter fusion',
      'Point cloud processing',
      'Voxel mapping and map diff',
      'Depth camera calibration and extrinsics',
      'Kalman filtering of sensor signals',
      'OpenCV',
    ],
  },
  {
    name: 'Software and infrastructure',
    items: [
      'Python',
      'C / C++',
      'TypeScript',
      'MATLAB',
      'Docker and dev containers',
      'GitHub Actions CI',
      'pytest, launch_testing',
      'Git',
    ],
  },
  {
    name: 'Tooling and design',
    items: ['Onshape', 'SolidWorks', 'Linux', 'Jetson Orin bring-up', 'Oscilloscope and bench characterization'],
  },
];
