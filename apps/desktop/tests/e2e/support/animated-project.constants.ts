/* @layer renderer-app @kind constants */
const ANIMATED = {
  project: 'Anim',
  palette: 'Main',
  side: 8,
  hero: 'hero',
  tree: 'tree',
  gem: 'gem',
  sheet: 'world',
  blink: 'blink',
  tag: 'run',
  marks: [
    { x: 1, y: 1, index: 2 },
    { x: 5, y: 5, index: 3 },
    { x: 3, y: 6, index: 4 },
  ],
  treeMark: { x: 2, y: 2, index: 5 },
  gemMark: { x: 4, y: 4, index: 6 },
} as const;

export { ANIMATED };
