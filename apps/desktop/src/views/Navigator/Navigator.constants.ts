/* @layer renderer-app @kind constants */
const NAVIGATOR_TEXT = {
  region: 'Navigator',
  area: 'Visible area',
  roleDescription: 'visible area of the image',
  hint: 'Drag the frame to pan. Click to centre. Arrow keys move it, Plus and Minus zoom, the wheel zooms.',
  empty: 'Open an asset to see its overview.',
  size: (width: number, height: number): string => `${width} x ${height} px`,
  describe: (view: { left: number; top: number; right: number; bottom: number; width: number; height: number; percent: number }): string =>
    `Showing x ${view.left} to ${view.right}, y ${view.top} to ${view.bottom} of ${view.width} by ${view.height} pixels at ${view.percent}%`,
} as const;

const NAVIGATOR_BOX = { height: 152 } as const;

const NAVIGATOR_KEY_SHARE = 0.125;

export { NAVIGATOR_BOX, NAVIGATOR_KEY_SHARE, NAVIGATOR_TEXT };
