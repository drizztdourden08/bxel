/* @layer renderer-app @kind constants */
const PICK_TEXT = {
  owned: (file: string): string => `${file} belongs to another open asset. Pick another name.`,
  replaceTitle: 'Replace the file?',
  replaceMessage: (file: string): string => `${file} already exists. Saving replaces it.`,
  replaceConfirm: 'Replace',
  replaceCancel: 'Cancel',
} as const;

export { PICK_TEXT };
