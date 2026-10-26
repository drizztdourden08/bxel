/* @layer renderer-app @kind constants */
import type { TagDirection } from '@bxel/document';

const TIMELINE_TEXT = {
  empty: 'No sprite is open.',
  title: 'Timeline',
  region: 'Timeline controls',
  grid: 'Frames and layers',
  transport: 'Playback',
  frames: 'Frame actions',
  cels: 'Cel actions',
  onion: 'Onion skin',
  tag: 'Tag',
  tagColour: 'Tag colour',
  tagColourAuto: 'Automatic colour',
  tagColourLabel: (name: string): string => `${name} tag colour`,
  frameLabel: (number: number, durationMs: number): string => `Frame ${number}, ${durationMs} milliseconds`,
  celLabel: (layer: string, number: number, state: string): string => `${layer}, frame ${number}, ${state}`,
  count: (frames: number, layers: number): string =>
    `${frames === 1 ? '1 frame' : `${frames} frames`}, ${layers === 1 ? '1 layer' : `${layers} layers`}`,
  status: (number: number, total: number, durationMs: number, fps: string): string =>
    `Frame ${number} of ${total}, ${durationMs} ms, ${fps}`,
  fps: (value: number): string => `${Number.isInteger(value) ? value : value.toFixed(1)} fps`,
  tagLabel: (name: string, direction: string): string => `${name}, ${direction}`,
  moveHint: 'Alt and Left or Right moves the frame. Alt and Shift and an arrow moves the cel. Drag a cel to move it.',
  pickHint: 'Control and click adds cels to the pick. Control and an arrow moves the cursor, Control and Space adds its cel.',
  laneHint: 'Tab reaches the tag bars and the frame headers. Left and Right move along them, Up and Down switch between them and the cels.',
  playHint: 'Enter or Space plays and pauses. Comma and period step by one frame.',
  moved: (number: number, total: number): string => `Frame moved to position ${number} of ${total}`,
  nothingToMove: 'There is no room to move the cels that way.',
  needTwoFrames: 'Pick two or more frames to link cels across.',
  linked: 'This cel is shared with other frames. Unlink it in the timeline before drawing on it.',
} as const;

const CEL_STATE_TEXT = { empty: 'empty', filled: 'filled', linked: 'linked' } as const;

const TIMELINE_LABEL = {
  addFrame: 'Add frame',
  duplicateFrame: 'Duplicate frames',
  deleteFrame: 'Delete frames',
  moveFrame: 'Move frames',
  duration: 'Set frame duration',
  addTag: 'Add tag',
  updateTag: 'Change tag',
  renameTag: 'Rename tag',
  colourTag: 'Colour tag',
  deleteTag: 'Delete tag',
  linkCel: 'Link cels',
  unlinkCel: 'Unlink cels',
  clearCel: 'Clear cels',
  moveCel: 'Move cels',
} as const;

const FIELD_LABEL = {
  duration: 'Frame duration in milliseconds, applied to the selected frames',
  tagName: 'Tag name',
} as const;

const TIMELINE_REF = { frame: 'frame', tag: 'tag', copy: 'copy' } as const;

const NEW_TAG_NAME = 'Tag';

const TAG_COLOURS: readonly string[] = ['rose', 'blue', 'amber', 'teal', 'violet', 'orange', 'lime', 'cyan', 'pink', 'green'];

const TAG_DIRECTIONS: readonly TagDirection[] = ['forward', 'reverse', 'pingpong'];

const TAG_DIRECTION_TEXT: Readonly<Record<TagDirection, string>> = {
  forward: 'Forward',
  reverse: 'Reverse',
  pingpong: 'Ping-pong',
};

export {
  CEL_STATE_TEXT,
  FIELD_LABEL,
  NEW_TAG_NAME,
  TAG_COLOURS,
  TAG_DIRECTION_TEXT,
  TAG_DIRECTIONS,
  TIMELINE_LABEL,
  TIMELINE_REF,
  TIMELINE_TEXT,
};
