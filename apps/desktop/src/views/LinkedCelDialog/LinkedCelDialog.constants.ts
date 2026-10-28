/* @layer renderer-app @kind constants */
const LINKED_TEXT = {
  title: 'This cel is linked',
  body: 'This cel is shared with other frames or layers. Choose once how painting on it should work. Bxel remembers your choice until you close the app.',
  unlink: 'This use only',
  unlinkDescription: 'Give this frame its own copy and paint on the copy. The other uses stay as they are.',
  all: 'All uses',
  allDescription: 'Paint on the shared cel, so every linked frame and layer shows the change.',
  cancel: 'Cancel',
} as const;

export { LINKED_TEXT };
