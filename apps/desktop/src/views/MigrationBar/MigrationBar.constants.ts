/* @layer renderer-app @kind constants */
const MIGRATION_TEXT = {
  region: 'Sprites that became animations',
  show: 'Show changes',
  saveAll: 'Save all',
  title: 'Sprites that became animations',
  intro: 'Each sprite with frames is now an animation that owns one sprite per frame. Nothing is written until you save.',
  close: 'Close',
  list: 'Changes',
  line: (sprite: string, animation: string, frames: number): string => `${sprite} became animation ${animation} with ${frames} ${frames === 1 ? 'frame' : 'frames'}`,
  tileLine: (sprite: string, animation: string, frames: number): string => `Tile ${sprite} now plays animation ${animation} with ${frames} ${frames === 1 ? 'frame' : 'frames'}`,
} as const;

export { MIGRATION_TEXT };
