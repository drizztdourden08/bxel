/* @layer renderer-app @kind constants */
const FRAME_BAR_TEXT = {
  region: 'Frame path',
  frame: (number: number, total: number): string => `Frame ${number} of ${total}`,
  owned: (name: string): string => `${name} (owned by this animation)`,
  shared: (name: string): string => `${name} (a sprite file)`,
  empty: 'No sprite yet',
  openSprite: 'Open sprite',
  makeCopy: 'Make a copy for this animation',
  clip: 'This frame shows a cell of its sprite. Pixels outside the cell are locked.',
  sharedHint: 'Drawing here changes the sprite file.',
  separator: '/',
} as const;

export { FRAME_BAR_TEXT };
