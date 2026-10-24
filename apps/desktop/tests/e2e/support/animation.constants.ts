/* @layer renderer-app @kind constants */
const ANIMATION = {
  side: 8,
  durations: [100, 250, 400],
  swatches: [3, 7, 11],
  file: 'walk.bxsprite',
  spriteName: 'walk',
  tagName: 'run',
} as const;

const ANIMATION_COLORS = Array.from({ length: 15 }, (_, at) => ({
  rgb: `#${[at * 15 + 20, 240 - at * 13, (at * 53) % 256].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`,
}));

export { ANIMATION, ANIMATION_COLORS };
