import type { CameraAngle } from './types';

export const CAMERA_ANGLES: CameraAngle[] = [
  {
    name: 'High Angle',
    description: 'A definitive high-angle shot. The camera is positioned high above the subject, tilted down. This perspective must make the subject appear smaller and more vulnerable. The background should show the ground/floor more prominently. Enforce correct perspective lines that converge downwards.',
  },
  {
    name: 'Low Angle',
    description: 'A definitive low-angle shot. The camera is positioned low to the ground, tilted up at the subject. This perspective must make the subject appear powerful, dominant, and larger than life. The background should show more of the ceiling or sky. Enforce correct perspective lines that converge upwards.',
  },
  {
    name: 'Close-Up',
    description: 'A tight close-up shot, framing the subject\'s face to capture subtle emotion. Maintain the original lighting and expression precisely.',
  },
  {
    name: 'Wide Shot',
    description: 'A wide shot that shows the full subject from head to toe, including ample space around them to clearly establish the environment and location.',
  },
  {
    name: 'Over-the-Shoulder',
    description: 'An over-the-shoulder shot. The camera is placed directly behind a subject, looking over their shoulder at the scene. The shoulder and side of the head of the foreground subject must be visible in the frame.',
  },
  {
    name: 'Dutch Tilt',
    description: 'A Dutch tilt (or Dutch angle) shot. The entire camera must be tilted on its axis, creating a diagonal composition that conveys a sense of unease, tension, or disorientation.',
  },
];