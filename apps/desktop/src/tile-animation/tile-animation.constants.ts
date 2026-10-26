/* @layer renderer-app @kind constants */
const TILE_ANIMATION_TEXT = {
  title: 'Animation',
  still: 'This tile is a still image.',
  stillHint: 'Choose an animation of the same size to play on this tile, or start one from the tile itself.',
  plays: (name: string, file: string, frames: number, cycleMs: number): string =>
    `Plays ${name} (${file}): ${frames} ${frames === 1 ? 'frame' : 'frames'}, ${cycleMs} ms loop`,
  preview: 'Animation preview',
  tag: 'Tag',
  wholeAnimation: 'Whole animation',
  start: 'Start',
  together: 'Together',
  random: 'Random',
  choose: 'Choose animation',
  chooseNone: 'Choose an animation...',
  edit: 'Edit',
  detach: 'Detach',
  fromTile: 'New animation from this tile',
  noFit: 'No animation fits this tileset yet.',
  broken: (issue: string): string => `This tile cannot play its animation: ${issue}`,
  sizeIssue: (name: string, width: number, height: number, tile: string): string =>
    `"${name}" is ${width} by ${height} pixels. A tile animation must be ${tile}, the tile size.`,
  paletteIssue: (name: string): string => `"${name}" uses another palette. Remap a copy of it to the palette of this tileset first.`,
  noAnimation: 'its animation does not exist.',
  noTag: 'its tag is not a span tag of the animation.',
  newName: (key: number): string => `Tile ${key}`,
  badge: 'Plays an animation',
} as const;

const TILE_ANIMATION_LABEL = {
  set: 'Set tile animation',
  detach: 'Detach tile animation',
  fromTile: 'Make an animation from a tile',
} as const;

const TILE_ANIMATION_REF = { animation: 'tile_animation', sprite: 'tile_frame' } as const;

const WHOLE_TAG = '';

const PREVIEW_BOX = 64;

export { PREVIEW_BOX, TILE_ANIMATION_LABEL, TILE_ANIMATION_REF, TILE_ANIMATION_TEXT, WHOLE_TAG };
