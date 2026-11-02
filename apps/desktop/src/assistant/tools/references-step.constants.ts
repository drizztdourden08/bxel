/* @layer renderer-app @kind constants */
const REFERENCES_STEP_TEXT = {
  noAsset: 'Open a sprite, tilemap or other asset to give it reference images.',
  full: 'That asset already shows the most reference images it can.',
  unknown: (id: string): string => `There is no reference image ${id}. get_view references lists them.`,
} as const;

export { REFERENCES_STEP_TEXT };
