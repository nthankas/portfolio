/**
 * FORTIS tables.
 *
 * Single source for every number that appears in both the project card and the
 * case study, so the two can never drift.
 *
 * Provenance, per table:
 *   capabilityTiers, chassisRequirements  build brief (sponsor-defined)
 *   actuators, armResults                 repository Monte Carlo results set
 *   orbitResults                          repository orbit sweep results set
 *   skidSteer                             repository drivetrain rejection study
 *   architecture                          read from the repository package tree
 *
 * Where the brief and the repository disagree, the repository wins and the
 * difference is recorded in ASSUMPTIONS.md.
 */

import type { Column } from '../components/DataTable.astro';

export const capabilityTiers = {
  caption: 'Sponsor-defined capability tiers',
  columns: [
    { head: 'Tier' },
    { head: 'Capability' },
    { head: 'Definition' },
  ] satisfies Column[],
  rows: [
    ['1', 'Floor traversal', 'Enter R0, traverse the tunnel, orbit toroidally'],
    ['2', 'Arm reach', 'Deploy a 30 in arm across the approved envelope'],
    ['3', 'Pick and stow', 'Pick a 3 lb object, stow the arm, retain the payload'],
    ['4', 'Lowering mechanism', 'Descoped to future work'],
  ],
};

export const chassisRequirements = {
  caption: 'Chassis requirements derived from the vessel',
  columns: [{ head: 'Requirement' }, { head: 'Value' }] satisfies Column[],
  rows: [
    ['Cross-section through port and tunnel', 'under 15.75 x 15.75 in'],
    ['Step straddle, diverter to floor plane', '4.5 in'],
    ['Sustained toroidal strafe', '0.10 m/s, under 2 in radial drift'],
    ['Floor condition', 'traction maintained on low-friction graphite'],
    ['Reactor surfaces', 'no modification permitted'],
  ],
};

export const skidSteer = {
  caption: 'Skid-steer step-crossing study, 60 configurations simulated',
  columns: [
    { head: 'Outcome' },
    { head: 'Configs', align: 'num' },
    { head: 'Max tilt (deg)', align: 'num' },
    { head: 'Radial drift (in)', align: 'num' },
  ] satisfies Column[],
  rows: [
    ['Completed the 90 deg turn', '3', '85 to 116', '7.0 to 10.1'],
    ['Failed to complete the turn', '57', 'n/a', 'n/a'],
    ['Completed within safe tilt', '0', 'n/a', 'n/a'],
  ],
  highlight: [[2, 1]] as [number, number][],
};

export const actuators = {
  caption: 'Arm actuator selection against simulated demand',
  columns: [
    { head: 'Joint' },
    { head: 'Actuator' },
    { head: 'Continuous rating (Nm)', align: 'num' },
    { head: 'P95 demand (Nm)', align: 'num' },
    { head: 'Peak demand (Nm)', align: 'num' },
  ] satisfies Column[],
  rows: [
    ['J1 yaw', 'NEMA 17, 25:1 cycloidal', '12.0', '0.05', '4.52'],
    ['J2 shoulder', 'NEMA 23, 20:1 planetary', '30.0', '14.67', '17.62'],
    ['J3 elbow', 'NEMA 17, 25:1 cycloidal', '12.0', '5.96', '6.74'],
    ['J4 wrist', 'Servo', '4.9', '1.90', '1.95'],
  ],
};

export const armResults = {
  caption: 'Constraint-aware Monte Carlo over the arm joint space',
  columns: [{ head: 'Result' }, { head: 'Value', align: 'num' }] satisfies Column[],
  rows: [
    ['Poses sampled uniformly across J1 to J4', '5,000'],
    ['Rejected by chassis, self and floor collision', '2,380'],
    ['Rejected by the reactor envelope filter', '606'],
    ['Reachable and collision-free inside the vessel', '2,014'],
    ['Analytically unstable poses', '0'],
    ['Stable under worst-case chassis mass', '1,989 of 2,014'],
    ['Worst tipping margin over valid poses', '0.022 m'],
    ['Mean tipping margin over valid poses', '0.081 m'],
  ],
  highlight: [[4, 1]] as [number, number][],
};

export const orbitResults = {
  caption: 'Orbit torque sweep, worst wheel per commanded speed',
  columns: [
    { head: 'Commanded speed (m/s)', align: 'num' },
    { head: 'Mean (Nm)', align: 'num' },
    { head: 'P95 (Nm)', align: 'num' },
    { head: 'Peak (Nm)', align: 'num' },
  ] satisfies Column[],
  rows: [
    ['0.10', '0.92', '3.44', '7.45'],
    ['0.15', '1.02', '3.25', '7.98'],
    ['0.20', '1.15', '3.45', '9.81'],
    ['0.25', '1.22', '3.59', '10.64'],
    ['0.30', '1.31', '4.10', '10.93'],
  ],
  highlight: [[4, 2]] as [number, number][],
};

export const orbitConditions = {
  caption: 'Orbit test conditions',
  columns: [{ head: 'Parameter' }, { head: 'Value', align: 'num' }] satisfies Column[],
  rows: [
    ['Orbit radius', '1.59 m'],
    ['Distance driven per speed', 'one full orbit'],
    ['Robot mass, arm stowed', '20.66 kg'],
    ['Step straddled throughout', '4.5 in'],
    ['Drive motor capability, 60 A continuous', '4.98 Nm'],
    ['Wheel model', '5-sphere roller chain'],
  ],
};

export const architecture = {
  caption: 'Workspace as pulled from the repository this session',
  columns: [
    { head: 'Component' },
    { head: 'Responsibility' },
    { head: 'Tests', align: 'num' },
  ] satisfies Column[],
  rows: [
    ['Mission supervisor', 'Table-driven state machine, authorises all motion', '37'],
    ['Drive control', 'X-drive kinematics to wheel setpoints, state gated', '30'],
    ['Arm control', 'Analytic inverse kinematics, motion action, motor bridge', '28'],
    ['Perception', 'Clouds, fusion, voxel map and diff, visual odometry, detection', '27'],
    ['Localisation', 'Wheel odometry, gyro debias, EKF composition', '21'],
    ['Simulation support', 'Synthetic camera rig standing in for hardware', '23'],
    ['Motor control wiring', 'Controller manager configuration and bring-up', '23'],
    ['Integration tests', 'Cross-component seams', '34'],
    ['Shared message types', 'Interface contract between components', 'n/a'],
  ],
};
