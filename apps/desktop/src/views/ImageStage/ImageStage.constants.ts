/* @layer renderer-app @kind constants */
const IMAGE_STAGE_TEXT = {
  region: 'Image preview',
  missing: 'This image could not be shown.',
  readOnly: 'Read only',
  readOnlyHint: 'An image opens as a preview. Import it to make a sprite, a sheet or an animation.',
  import: 'Import...',
  importHint: 'Turn this image into a sprite, a sheet or an animation.',
  size: (width: number, height: number): string => `${width} x ${height}`,
  frames: (count: number): string => `${count} frames`,
  label: (name: string): string => `Preview of ${name}`,
} as const;

export { IMAGE_STAGE_TEXT };
