/* @layer renderer-app @kind constants */
const FOLDER_SHEET = 'walk';

const FOLDER_STRAY = 'stray';

const FOLDER_SPRITES = [
  { name: 'hero', width: 16 },
  { name: 'slime', width: 16 },
  { name: 'tiny', width: 8 },
  { name: 'fx/glow', width: 16 },
  { name: 'fx/spark', width: 16 },
] as const;

export { FOLDER_SHEET, FOLDER_SPRITES, FOLDER_STRAY };
