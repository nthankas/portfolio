import type { ImageMetadata } from 'astro';

/**
 * Figure registry.
 *
 * Alt text describes the engineering content of each figure, not its title.
 * `source` states where the image came from, and is rendered under the caption.
 *
 * Every entry here was opened and read before its alt text was written; the
 * filenames in the asset bundle do not reliably describe their contents
 * (`fortis-orbit-sim-topview.png`, for instance, is the per-wheel torque plot).
 */

const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/figures/**/*.{png,jpg,jpeg}',
  { eager: true },
);

export interface Figure {
  src: ImageMetadata;
  alt: string;
  caption: string;
  source: string;
}

type Entry = { file: string; alt: string; caption: string; source: string };

const registry: Record<string, Entry> = {
  // ------------------------------------------------------------- FORTIS ---

  'fortis-block-diagram': {
    file: 'fortis/fortis-system-block-diagram.png',
    alt: 'System block diagram with three subsystem groups around a Jetson Orin Nano. Vision: four OAK-D Lite cameras into a USB hub, plus an arm-mounted OAK-D Pro, all on USB. Arm subsystem: a Teensy 4.1 over USB serial driving a gripper servo and J4 wrist servo on PWM, and J1 to J3 closed-loop steppers over three step and direction channels, with a dashed encoder feedback return. Chassis subsystem: four ODrive S1 controllers driving M8325s motors on a daisy-chained CAN bus. An operator PC connects over Ethernet running ROS 2 DDS.',
    caption:
      'Compute and interface topology. Every camera is a USB device on the Jetson; the drive bus is CAN and the arm link is USB serial, so the three subsystems fail independently.',
    source: 'FORTIS design defense deck',
  },

  'fortis-software-layers': {
    file: 'fortis/fortis-software-integration-a.png',
    alt: 'Three-tier software diagram. The bottom tier is a shared message contract covering drive, arm, perception and UI. The middle tier is a single mission state machine block labelled as authorizing all motion. The top tier holds four action subsystems: drive and arm drawn solid, targeting planner and operator UI drawn dashed as planned work.',
    caption:
      'Authorization topology at design defense. Every action subsystem sits above the mission state machine rather than beside it, so a subsystem cannot move without the state machine granting it.',
    source: 'FORTIS design defense deck. Arm has since moved past the scaffolded state shown here.',
  },

  'fortis-mission-states': {
    file: 'fortis/fortis-software-integration-b.png',
    alt: 'Mission state diagram with eight boxes and directed arrows. IDLE leads to ORBIT, then TARGETING, then ARM_AT_VIEW. From ARM_AT_VIEW a bidirectional pair connects to INSPECT and a one-way arrow leads to PICK, then HOLDING. Both HOLDING and ARM_AT_VIEW return to RETURN_HOME, which returns to IDLE. A footnote states the FAULT state is reachable from any state on guard violation and is omitted for clarity.',
    caption:
      'Mission phases and the transitions between them. The FAULT state is reachable from every state through an unguarded wildcard, which is what lets the drive-health monitor latch a fault from anywhere.',
    source: 'FORTIS design defense deck',
  },

  'fortis-validation-loop': {
    file: 'fortis/fortis-simulation-driven-validation-loop.png',
    alt: 'Flow diagram of the design iteration loop. Electromechanical leads supply geometry, motors and materials to Isaac Sim, which simulates kinematics, torques and stability and returns results to a sprint review gate asking whether the design is viable. A dashed feedback path from the gate returns to the leads to revise geometry, motors, materials, arm length and weight. A second path goes to a power lead review and then to a converged design with the arm length locked at 30 inches and the bill of materials set.',
    caption:
      'The loop that replaced physical prototypes. No geometry left the loop until a sprint review had seen simulated torque and stability numbers for it.',
    source: 'FORTIS design defense deck',
  },

  'fortis-orbit-torque': {
    file: 'fortis/fortis-orbit-sim-topview.png',
    alt: 'Line chart of per-wheel torque against commanded orbit speed from 0.10 to 0.30 meters per second. Four solid lines show 95th-percentile torque per wheel and four dashed lines show mean torque. The front-left wheel is highest throughout, rising from 3.44 to 4.10 newton meters. The other three wheels track between 2.06 and 3.49 newton meters. Horizontal reference lines mark motor continuous ratings at 3.32, 4.98 and 5.81 newton meters.',
    caption:
      'Worst-wheel 95th-percentile torque stays under the 60 A continuous rating of 4.98 Nm across the whole speed range. The front-left wheel runs consistently highest because the arm center of gravity sits forward of chassis center.',
    source: 'Isaac Sim orbit sweep, 5-sphere roller model.',
  },

  'fortis-arm-torque': {
    file: 'fortis/fortis-arm-stability-poloidal-map.png',
    alt: 'Grouped bar chart of torque per arm joint over 2,014 valid Monte Carlo poses, with mean, 95th percentile and peak bars for each joint and a dashed continuous-rating line above each group. J1 yaw peaks at 4.52 against a 12 newton metre rating. J2 shoulder is the loaded joint, with a mean of 7.43, 95th percentile of 14.67 and peak of 17.62 against a 30 newton metre rating. J3 elbow peaks at 6.74 against 12. J4 wrist peaks at 1.95 against 4.9.',
    caption:
      'Per-joint torque across the reachable pose set. Every joint peaks below 60 percent of its continuous rating, and J2 carries roughly 1.7 times margin at its worst pose.',
    source: 'Isaac Sim Monte Carlo sweep, 5,000 samples filtered to 2,014 valid poses.',
  },

  'fortis-poloidal-map': {
    file: 'fortis/fortis-arm-joint-torque-results.png',
    alt: 'Scatter plot on a DIII-D poloidal cross-section, with radius in inches on the horizontal axis and height in inches on the vertical. The center stack is a vertical line at left and the outer wall is a curve at right. A side view of the chassis straddling the step sits at the bottom near minus 45 inches. Several thousand reachable end-effector points fan out above it, colored by analytical tipping margin on a scale from red to green; effectively all points are green, meaning positive margin.',
    caption:
      'Reachable end-effector positions inside the vessel envelope, colored by tipping margin. The arm base sits at the chassis on the step and the reachable set stays clear of the center stack and the outer wall.',
    source:
      'Isaac Sim Monte Carlo sweep, plotted against the DIII-D poloidal cross-section. Pose counts on the plot are from an earlier filter revision than the tables.',
  },

  'fortis-mc-sampling': {
    file: 'fortis/fortis-arm-montecarlo-pose-sweep.png',
    alt: 'Four histograms side by side, one per joint, each showing 5,000 Monte Carlo draws binned across the joint range. J1, J2 and J3 span plus and minus 180 degrees and J4 spans plus and minus 100 degrees. A dashed reference line at 139 counts per bin marks the expected uniform density, and every histogram sits close to it.',
    caption:
      'Verification that the joint-space draws were actually uniform before any filtering. Checking the sampler is what makes the downstream pass rates meaningful.',
    source: 'Isaac Sim Monte Carlo sweep, sampling histogram.',
  },

  'fortis-endoskeleton-cad': {
    file: 'fortis/fortis-endoskeleton-cad.png',
    alt: 'Four-view engineering drawing of the chassis. The top view shows an octagonal frame with four omni wheels at the 45 degree chamfered corners, dimensioned 18.680 inches across and 14.825 inches deep including wheels. The front view is dimensioned 8.965 inches tall and shows a raised central arch between the wheels with a row of small idler rollers along its underside. Isometric and side views complete the sheet.',
    caption:
      'Chassis geometry with wheels included. The chamfered corners are what let the wheels mount at 45 degrees while keeping the body inside the entry profile, and the arch carries the belly idler rollers.',
    source: 'FORTIS CAD, expanded chassis drawing. Drawn by Adrian Pena.',
  },

  'fortis-internal-layout': {
    file: 'fortis/fortis-endoskeleton-internal-layout.png',
    alt: 'Top-down CAD render of the chassis interior with the top plate removed. Four omni wheels sit at the chamfered corners. Inside the octagonal frame, four motor controllers are mounted diagonally at the corners next to their motors, a compute board sits at the top center, and three horizontal terminal blocks run down the middle of the plate.',
    caption:
      'Internal packaging. Each drive controller sits beside the motor it drives so the high-current runs stay short, leaving the center channel for compute and signal routing.',
    source: 'FORTIS CAD, internal layout view.',
  },

  'fortis-arm-subsystem': {
    file: 'fortis/fortis-arm-subsystem-overview.png',
    alt: 'Arm subsystem block diagram. A Teensy 4.1 receives USB serial from the host and drives three outputs: PWM to a gripper servo, PWM to the J4 wrist servo, and three step and direction channels to the J1, J2 and J3 closed-loop steppers through CL57T drivers. A dashed encoder line returns from the steppers to the Teensy.',
    caption:
      'The arm motion path. Coordinated multi-axis stepping runs on the microcontroller rather than the host, so trajectory timing does not depend on the operating system scheduler.',
    source: 'FORTIS design defense deck',
  },

  'fortis-arm-stow': {
    file: 'fortis/fortis-arm-collapsible-port-profile.png',
    alt: 'Four-view engineering drawing of the arm folded into its stowed configuration. The side view is dimensioned 16.877 inches long by 2.744 inches tall, with three links folded back against each other and the motors visible at the joints. Top, front and isometric views show the gripper tucked between the links. The title block gives a mass of 11.36 pounds.',
    caption:
      'The arm collapsed to its stow profile. Reach was traded down to 30 inches specifically so the folded envelope and the actuator torques both stayed inside budget.',
    source: 'FORTIS CAD, arm collapsed drawing. Drawn by Carlos Vazquez Perez.',
  },

  'fortis-chassis-built': {
    file: 'fortis/fortis-chassis-step-straddle.png',
    alt: 'Photograph of the assembled aluminum chassis on a workbench, viewed at an angle. Two black omni wheels with double rows of perimeter rollers are visible at the near corners. The machined aluminum body has an arched underside between the wheels, and wiring plus a sensor board are mounted along the top plate.',
    caption:
      'The fabricated chassis with omni wheels mounted. The arched underside between the wheels is the clearance profile that carries the robot over the port lip.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-tokamak-context': {
    file: 'fortis/fortis-diiid-tokamak-context.png',
    alt: 'Photograph looking into the DIII-D vacuum vessel. The toroidal chamber curves away in both directions around a tall tiled center column, and a person in a green coverall stands inside the chamber at the right, roughly as tall as the column is wide.',
    caption:
      'The operating environment, with a person inside for scale. Every interior surface is tiled and none of it may be modified or contacted.',
    source: 'General Atomics DIII-D reference photograph.',
  },

  'fortis-r0-port': {
    file: 'fortis/fortis-r0-port-tunnel.png',
    alt: 'CAD view inside the vessel looking down and along the floor. The tiled center column rises at left, the floor tiles curve toroidally away to the right, and a raised ledge runs between the inner and outer floor levels. Two markers highlight points along the ledge.',
    caption:
      'The floor the robot drives on, in CAD. The orbit runs along this curve, and the ledge running through the middle of it is the step the chassis straddles.',
    source: 'FORTIS design defense deck, reactor CAD.',
  },

  'fortis-diverter-step': {
    file: 'fortis/fortis-lower-diverter-step.png',
    alt: 'Close CAD view of the reactor floor at the diverter. Tiled floor panels in the foreground meet a raised, rounded ledge that separates the lower floor plane from the upper one behind it, with a large rectangular opening in the wall above.',
    caption:
      'The step between the diverter and floor planes at close range. The rounded top edge is what makes straddling viable and climbing unnecessary.',
    source: 'FORTIS design defense deck, reactor CAD.',
  },

  'fortis-chassis-front': {
    file: 'fortis/fortis-fabrication-welded-frame.png',
    alt: 'Front-view photograph of the assembled chassis. Two large black omni wheels with double rows of perimeter rollers flank a machined aluminum body whose underside is cut into a raised arch between the wheels. A depth camera is mounted centrally on the top edge with its cable routed over the back.',
    caption:
      'The assembled chassis seen head on. The arch between the wheels is the underbelly clearance profile, and the camera sits on the face that leads during the orbit.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-isaac-viewport': {
    file: 'fortis/fortis-orbit-sim-torque-vs-speed.jpg',
    alt: 'Screenshot of the Isaac Sim viewport looking straight down into the reactor model. The vessel is a ring of tiled floor panels around a dark centre bore, and the robot sits on the outer floor at the bottom of the ring, small against the vessel, oriented for a toroidal orbit.',
    caption:
      'The simulation the drivetrain numbers came from: the chassis on the reactor floor in Isaac Sim, viewed from above, mid orbit.',
    source: 'Isaac Sim capture, orbit test.',
  },

  'fortis-wiring-asbuilt': {
    file: 'fortis/fortis-internal-wiring-as-built.png',
    alt: 'Top-down photograph of the finished chassis with the top skin removed. Four omni wheels sit at the corners. Inside the octagonal aluminum frame, four motor controllers sit at the corners beside their motors, and the centre channel carries the harness: red power runs, black data cables and white USB lines tied off to the frame, with four cameras mounted on the outside faces.',
    caption:
      'The as-built interior. The packaging follows the CAD layout: controllers at the corners beside their motors, harness down the centre channel, one camera per face.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-machined-parts': {
    file: 'fortis/fortis-endoskeleton-build-a.png',
    alt: 'Photograph of chassis parts in fabrication on a steel table. Lengths of aluminum square tube are marked up in red with joint labels and weld arrows. Beside them sits a machined camera mount plate with a large circular bore and countersunk holes, next to sheet stock scribed with the octagon profile. A partially welded frame corner is visible at the left edge.',
    caption:
      'Frame stock marked for welding and the first machined camera plate. Every tube carries its joint label because the octagon only closes if the miter sequence is followed.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-welded-ring': {
    file: 'fortis/fortis-fabrication-assembled-chassis.png',
    alt: 'Photograph of the welded aluminum endoskeleton ring laid flat on cardboard: an octagonal frame of square tube with mounting flanges riveted along the faces, before any components are installed.',
    caption: 'The endoskeleton ring after welding, before anything was mounted to it.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-front-face': {
    file: 'fortis/fortis-fabrication-front-view.png',
    alt: 'Head-on photograph of the assembled chassis at bench height. The two front omni wheels with their double roller rings dominate the frame, the front depth camera is mounted on a black bracket at the top centre of the aluminum face, and the word front is hand-written on the panel below it.',
    caption:
      'The face that leads during the orbit: front depth camera on its bracket, wheels toed at 45 degrees. The handwriting is the fabrication-floor way of keeping the camera extrinsics honest.',
    source: 'FORTIS fabrication photograph.',
  },

  'fortis-motor-rollers': {
    file: 'fortis/fortis-endoskeleton-build-b.png',
    alt: 'Photograph of a large black brushless outrunner motor on its square mounting plate, lying on a steel table next to a row of white 3D printed belly idler roller assemblies, each a bar with rounded roller ends and printed mounting bosses.',
    caption:
      'One of the four direct-drive outrunners beside the printed belly idler rollers. The rollers are what carry the chassis over the port lip during entry, and they never touch the floor during normal driving.',
    source: 'FORTIS fabrication photograph.',
  },

  // -------------------------------------------------------------- WALL-E ---

  'walle-hsm-whiteboard': {
    file: 'walle/walle-hsm-whiteboard.png',
    alt: 'Photograph of a whiteboard covered in red marker showing an early state machine plan. A main hierarchical state machine is broken into a search sub-machine listing left sweep, right sweep and advance, a grab sub-machine listing approach, grab block, push green and return home, and a sort sub-machine split into red and blue sub-sub-machines. Sketches of the field with red and blue drop zones and several transition graphs fill the rest of the board.',
    caption:
      'The first architecture. Acquisition is built around an ultrasonic sweep, and the sort branch is already split red against blue.',
    source: 'Project working notes, ECE 118/218.',
  },

  'walle-hsm-final': {
    file: 'walle/walle-final-state-machine.png',
    alt: 'Final state machine diagram with four labelled sub-machine columns. CenterSubHSM, LeftSubHSM and RightSubHSM each run the same acquisition sequence of align, approach, grab, check field and return, with transitions labelled by infrared line events rather than distance events. Each exits to SortState. The fourth column, SortSubHSM, branches on detected color into RedFlow and BlueFlow sub-machines that turn, drop, realign and increment the stage counter, ending after the fourth stage.',
    caption:
      'The architecture that shipped. Acquisition is now driven by infrared line events, and the three zone columns run the same sequence, so reordering a zone changes the sequence rather than the behavior.',
    source: 'ECE 118/218 final report.',
  },

  'walle-field': {
    file: 'walle/walle-field-setup.png',
    alt: 'Overhead photograph of the field during a run. A white board is marked with black tape: a large semicircular arc, a straight boundary line across the bottom, and a cross at the center. A red block sits at the top edge, a green block at the left and a blue block at the right. The robot sits at the center of the cross with its gripper arms open, and an operator reaches in from the bottom of the frame.',
    caption:
      'The field as run. The taped arc and cross are the entire navigation reference, which is what replaced the rangefinder sweep.',
    source: 'ECE 118/218 project photograph.',
  },

  'walle-cad': {
    file: 'walle/walle-cad-mockup.png',
    alt: 'CAD render of the robot, styled after the film character it is named for: a boxy yellow and grey laser-cut body with a binocular head on top, a single rear wheel visible, and two flat gripper arms extending forward on rails. A red cube sits between the open arms.',
    caption:
      'Chassis mockup with a block presented between the gripper arms. That fixed presentation distance is what made color classification repeatable.',
    source: 'ECE 118/218 final report.',
  },

  'walle-drawing': {
    file: 'walle/walle-cad-drawing.png',
    alt: 'Four-view assembly drawing of the robot: front view with the binocular head and both gripper arms, isometric view approaching a block, top view showing the internal bay layout between the drive wheels, and side view showing the arm reach past the chassis front.',
    caption:
      'Assembly drawing of the final build. The gripper arms and the block presentation distance visible in the side view are the geometry that fixed the color sensing standoff.',
    source: 'ECE 118/218 final report.',
  },

  'walle-wiring': {
    file: 'walle/walle-wiring-schematic.png',
    alt: 'Wiring schematic centered on the Uno32 board. A color sensor connects on four filter-select and output lines at top left, two RC servos take PWM below it, and an H-bridge driver at right takes four direction lines and two enable lines and drives two motors. An ultrasonic rangefinder takes a trigger line and returns an echo line, two infrared reflectance sensors return output lines, and a 5 V regulator with two decoupling capacitors feeds the logic from a 9.9 V battery.',
    caption: 'Sensor and actuator wiring. Every sensor on the board returns a discrete line the software turns into an event.',
    source: 'ECE 118/218 final report.',
  },
};

function resolve(entry: Entry): ImageMetadata {
  const key = `../assets/figures/${entry.file}`;
  const mod = files[key];
  if (!mod) {
    throw new Error(
      `Figure asset missing: ${entry.file}. Expected at src/assets/figures/${entry.file}.`,
    );
  }
  return mod.default;
}

export const figures: Record<string, Figure> = Object.fromEntries(
  Object.entries(registry).map(([id, entry]) => [
    id,
    { src: resolve(entry), alt: entry.alt, caption: entry.caption, source: entry.source },
  ]),
);

export function getFigure(id: string): Figure {
  const fig = figures[id];
  if (!fig) throw new Error(`Unknown figure id: ${id}`);
  return fig;
}
