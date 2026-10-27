/* @layer renderer-app @kind logic */
import { PromptRefused } from './prompt-refused';
import type { PromptKind, PromptPort } from './prompt-port.type';

const refuse = (prompt: PromptKind) => (): Promise<never> => Promise.reject(new PromptRefused(prompt));

const refusingPrompts = (): PromptPort => ({
  saveAs: refuse('saveAs'),
  confirm: refuse('confirm'),
});

export { refusingPrompts };
