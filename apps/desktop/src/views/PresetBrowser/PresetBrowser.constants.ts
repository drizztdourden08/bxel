/* @layer renderer-app @kind constants */
const PRESET_BROWSER_TEXT = {
  intro: 'The platform presets that ship with Bxel. You pick one for a project in the Project settings, or for one sprite in the Asset settings.',
  canvas: (width: number, height: number): string => `A new sprite starts at ${width} by ${height} pixels.`,
} as const;

export { PRESET_BROWSER_TEXT };
