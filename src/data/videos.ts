/**
 * FORTIS demo clips.
 *
 * Nine clips live in the owner's Google Drive demo folder, shared as anyone
 * with the link (checked September 2026). Three more are on YouTube. Each
 * entry carries the Drive file id or the YouTube id; the player embeds the
 * matching iframe, lazy-loaded, so the clips cost nothing at page load and
 * nothing has to be re-hosted.
 *
 * To self-host one instead (removes the Drive dependency and the sharing
 * requirement): encode a web-friendly MP4, drop it and a poster frame into
 * `public/video/`, and fill in `file` and `poster`. A local file wins over the
 * Drive embed.
 *
 *   ffmpeg -i in.mov -vf scale=1280:-2 -c:v libx264 -crf 24 -an out.mp4
 *   ffmpeg -i out.mp4 -ss 00:00:01 -frames:v 1 out.jpg
 */

export interface Video {
  /** Filename under public/video/. Null while the clip is served from Drive. */
  file: string | null;
  poster: string | null;
  /** Google Drive file id for the embedded player. */
  drive: string | null;
  /** YouTube video id, used instead of Drive when set. */
  youtube?: string | null;
  /** YouTube playlist id. With `youtube` set, the embed opens that video inside the list. */
  playlist?: string | null;
  /** What the clip shows. Rendered whether or not any player is available. */
  caption: string;
  source: string;
  /** Original filename in the owner's Design Defense folder. */
  origin: string;
}

export const videos = {
  controlDemo: {
    file: null,
    poster: null,
    drive: null,
    youtube: 'oBF4cOx7-Ic',
    caption:
      'Control demo: the chassis under operator command through the drive stack, with the mission state gate, the X-drive kinematics and closed-loop wheel velocity in the loop.',
    source: 'Team demo video, YouTube.',
    origin: 'youtu.be/oBF4cOx7-Ic',
  },
  visionDemo: {
    file: null,
    poster: null,
    drive: null,
    youtube: 'wVuB0_i8wws',
    caption:
      'Vision demo: the perception stack running on the robot, with the camera streams, point clouds and detections in the operator interface.',
    source: 'Team demo video, YouTube.',
    origin: 'youtu.be/wVuB0_i8wws',
  },
  demoPlaylist: {
    file: null,
    poster: null,
    drive: null,
    youtube: 'cuDwkSAfIYw',
    playlist: 'PLJzUDX4y0hPBtgdsXaRwX__4a0BTDvUJF',
    caption:
      'The team demo playlist. Use the list control in the player to move between clips.',
    source: 'Team demo playlist, YouTube.',
    origin: 'youtube.com/playlist?list=PLJzUDX4y0hPBtgdsXaRwX__4a0BTDvUJF',
  },
  eStop: {
    file: null,
    poster: null,
    drive: '17D4q4TgNyVyffA3ENmCJMMkPmypKJAOk',
    caption:
      'Hardware emergency stop: the operator-side E-stop cutting all robot motion. Measured at 1.58 s to full stop across three trials, implemented as a hardware interruption of the supply with no software in the loop.',
    source: 'Hardware demonstration.',
    origin: 'E-Stop.mp4',
  },
  orbitSim: {
    file: null,
    poster: null,
    drive: '1jn3fZGEAZ2xPNyW2ASwgrBdba79Qv33c',
    caption:
      'Isaac Sim orbit test: the chassis driving one full toroidal orbit while straddling the step, which is the run the per-wheel torque sweep was measured from.',
    source: 'Isaac Sim capture.',
    origin: 'IsaacSim_OrbitTest.mp4',
  },
  armSim: {
    file: null,
    poster: null,
    drive: '1syO_u6rCnMnn3ILzld-GY0pYJCIegZ7K',
    caption:
      'Isaac Sim arm run: the 30 inch carbon fiber arm moving through the reach envelope under a 3 lb payload, which is the configuration the actuator sizing was computed against.',
    source: 'Isaac Sim capture.',
    origin: 'Arm30InchSimulationCarbonFiber.mp4',
  },
  toroidal: {
    file: null,
    poster: null,
    drive: '1BcgHxDNN7qaBtMkVJexZhIrJMerW9juj',
    caption:
      'Hardware toroidal motion: the assembled chassis strafing along the vessel under operator command with closed-loop wheel velocity. This is the Tier 1 capability demonstration.',
    source: 'Hardware demonstration.',
    origin: 'Toroidal Movemement.mp4',
  },
  portEntry: {
    file: null,
    poster: null,
    drive: '1l7b_nY18hmkEr7_h6eBwOSM-6ptbW0YH',
    caption:
      'Hardware port entry: the chassis passing through the entrance profile, with the belly idler rollers carrying it over the port lip.',
    source: 'Hardware demonstration.',
    origin: 'PortHole Entrance.mp4',
  },
  visionUi: {
    file: null,
    poster: null,
    drive: '1LnYDP_IDmlIafTbWi77Is2KW7674sXcr',
    caption:
      'Perception and operator interface: live camera streams with the visualization bridge running, which is how a target is selected during a mission.',
    source: 'Hardware demonstration.',
    origin: 'UI and Vision Test.mp4',
  },
  pickStow: {
    file: null,
    poster: null,
    drive: '1y6r_EktbDXroJr73EeF-_vmlNKghbh9M',
    caption:
      'Hardware pick and stow: commanded arm motion through the reach envelope, closing on an object and folding back to the stow pose. This is the Tier 3 capability demonstration.',
    source: 'Hardware demonstration.',
    origin: 'Arm pick and stow.mov',
  },
  payloadHold: {
    file: null,
    poster: null,
    drive: '1rfcRp3M5bgwNcATLAvsUi1IUfy1jkOjy',
    caption:
      'Hardware payload hold: the arm retaining a 3 lb object through the stow motion, which is the payload the whole actuator budget was sized against.',
    source: 'Hardware demonstration.',
    origin: 'Arm with 3lb Hold.mp4',
  },
  holonomic: {
    file: null,
    poster: null,
    drive: '17jxWy0U1d-IcZnKTsC4tbGW_fqg1iq6r',
    caption:
      'Hardware holonomic motion: the chassis rotating in place, showing yaw decoupled from translation on the X-drive.',
    source: 'Hardware demonstration.',
    origin: 'Spin_In_Circles.mp4',
  },
} as const satisfies Record<string, Video>;

export type VideoId = keyof typeof videos;
