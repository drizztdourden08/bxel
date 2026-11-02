/* @layer renderer-app @kind constants */

const ANNOUNCE_TEXT = {
  movedToPlace: (position: number, total: number): string => `Moved to place ${position} of ${total}`,
  trimmed: (count: number): string => (count === 1 ? 'Trimmed 1 sprite' : `Trimmed ${count} sprites`),
} as const;

export { ANNOUNCE_TEXT };
