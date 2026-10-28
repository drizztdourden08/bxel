/* @layer renderer-app @kind constants */
const NAVIGATOR_TEXT = {
  region: 'Navigator',
  area: 'Visible area',
  roleDescription: 'visible area of the image',
  hint: 'Drag the frame to pan. Click to centre. Arrow keys move it, Plus and Minus zoom, the wheel zooms.',
  empty: 'Open an asset to see its overview.',
  caption: (width: number, height: number, percent: number): string => `${width} x ${height} px, ${percent}% shown`,
  describe: (view: { left: number; top: number; right: number; bottom: number; width: number; height: number; percent: number }): string =>
    `Showing x ${view.left} to ${view.right} and y ${view.top} to ${view.bottom} of an image ${view.width} by ${view.height} pixels, at ${view.percent}% zoom`,
} as const;

const NAVIGATOR_BOX = { height: 108 } as const;

const NAVIGATOR_KEY_SHARE = 0.125;

export { NAVIGATOR_BOX, NAVIGATOR_KEY_SHARE, NAVIGATOR_TEXT };
