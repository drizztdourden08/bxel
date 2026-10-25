/* @layer renderer-app @kind constants */
const IMPORTED_ANIMATION = {
  side: 4,
  delaysMs: [50, 120, 200],
  colours: [
    [224, 36, 94, 255],
    [63, 208, 168, 255],
    [40, 90, 220, 255],
  ],
  gifFile: 'run.gif',
  apngFile: 'jump.png',
  gifName: 'run',
  apngName: 'jump',
} as const;

export { IMPORTED_ANIMATION };
