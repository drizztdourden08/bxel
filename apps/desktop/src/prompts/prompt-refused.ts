/* @layer renderer-app @kind logic */
import type { PromptKind } from './prompt-port.type';

class PromptRefused extends Error {
  readonly prompt: PromptKind;

  constructor(prompt: PromptKind) {
    super(`An assistant call may not open a ${prompt} dialog.`);
    this.name = 'PromptRefused';
    this.prompt = prompt;
  }
}

export { PromptRefused };
