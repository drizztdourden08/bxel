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

const IMAGE_MENU = {
  zone: 'image.stage',
  label: 'Image actions',
  copy: 'Copy image',
  zoomIn: 'Zoom in',
  zoomOut: 'Zoom out',
  actualSize: 'Actual size',
  copied: 'Copied the image.',
  copyFailed: 'The image could not be copied.',
} as const;

const IMAGE_ZOOM = { factor: 2, min: 0.25, max: 128, actual: 1 } as const;

export { IMAGE_MENU, IMAGE_STAGE_TEXT, IMAGE_ZOOM };
