/* @layer core @kind logic */
import type { CommandError } from './command-error.type';

class CommandFailure extends Error {
  readonly error: CommandError;

  constructor(error: CommandError) {
    super(error.message);
    this.name = 'CommandFailure';
    this.error = error;
  }
}

export { CommandFailure };
