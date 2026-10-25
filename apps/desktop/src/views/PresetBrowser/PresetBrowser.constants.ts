/* @layer renderer-app @kind constants */
const PRESET_BROWSER_TEXT = {
  intro: 'The platform presets that ship with Bxel. You pick one for a project in the Project settings, or for one sprite in the Asset settings.',
  canvas: (width: number, height: number): string => `New sprites ${width} by ${height}.`,
} as const;

export { PRESET_BROWSER_TEXT };
