/* @layer renderer-app @kind logic */
const pixelViewportClass = (className: string | undefined, hand: boolean): string =>
  ['pixel-viewport', hand ? 'pixel-viewport--hand' : '', className ?? ''].filter(Boolean).join(' ');

export { pixelViewportClass };
