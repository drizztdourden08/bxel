/* @layer renderer-app @kind constants */
import type { PromptKind } from './prompt-port.type';

const DIALOG_METHODS: readonly PromptKind[] = ['open', 'saveAs', 'openFolder', 'regrant'];

export { DIALOG_METHODS };
