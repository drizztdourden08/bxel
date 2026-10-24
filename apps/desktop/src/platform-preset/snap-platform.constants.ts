/* @layer renderer-app @kind constants */
const SNAP_LABEL = 'Snap palette to platform';

const SNAP_PREVIEW_LIMIT = 24;

const SNAP_TEXT = {
  action: 'Snap palette to platform',
  apply: 'Snap colours',
  cancel: 'Cancel',
  title: 'Colours before and after',
  noPlatform: 'Choose a platform first.',
  nothing: 'Every colour is already on the platform grid.',
  tooMany: (count: number, limit: number): string => `${count} colours would change. One step holds up to ${limit}. Snap fewer palettes.`,
  failed: (reason: string): string => `Could not snap the palette. ${reason}`,
  summary: (count: number, banks: number): string =>
    `${count} ${count === 1 ? 'colour moves' : 'colours move'} to the platform grid in ${banks} ${banks === 1 ? 'palette' : 'palettes'}. This is one undo step.`,
  done: (count: number): string => `Snapped ${count} ${count === 1 ? 'colour' : 'colours'} to the platform grid.`,
  more: (count: number): string => `and ${count} more`,
  pair: (bank: string, index: number, before: string, after: string): string => `${bank}, slot ${index}: ${before} to ${after}`,
  before: 'Before',
  after: 'After',
} as const;

export { SNAP_LABEL, SNAP_PREVIEW_LIMIT, SNAP_TEXT };
