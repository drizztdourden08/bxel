/* @layer renderer-app @kind constants */
const UNPACK_FALLBACK = 'project';

const PACK_TEXT = {
  menu: 'Pack project...',
  saveTitle: 'Pack the project into one file',
  filter: 'Bxel project',
  outside: 'Choose a place outside the project folders.',
  packed: (count: number): string => (count === 1 ? 'Packed the project with one asset.' : `Packed the project with ${count} assets.`),
  failed: (reason: string): string => `Could not pack the project. ${reason}`,
  unpackTitle: 'Choose where to unpack the project',
  unpackIntro: (name: string): string => `${name} is a packed project. Pick the folder to unpack it into.`,
  unpacked: (name: string): string => `Unpacked the project ${name}.`,
  unpackFailed: (reason: string): string => `Could not unpack the project. ${reason}`,
  skipped: (count: number): string => (count === 1 ? 'One file in the pack was left out.' : `${count} files in the pack were left out.`),
} as const;

export { PACK_TEXT, UNPACK_FALLBACK };
