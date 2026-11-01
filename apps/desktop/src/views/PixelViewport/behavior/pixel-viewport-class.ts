/* @layer renderer-app @kind logic */
const pixelViewportClass = (className: string | undefined, hand: boolean, mirror = false): string =>
  ['pixel-viewport', hand ? 'pixel-viewport--hand' : '', mirror ? 'pixel-viewport--mirror' : '', className ?? ''].filter(Boolean).join(' ');

export { pixelViewportClass };
