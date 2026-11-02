/* @layer renderer-app @kind constants */
const DROP_LAYER_TEXT = {
  title: 'Paste as new layer',
  message: (name: string): string => `Add the pixels of ${name} to this sprite as a new layer.`,
  layer: 'Paste as new layer',
  cancel: 'Cancel',
} as const;

export { DROP_LAYER_TEXT };
