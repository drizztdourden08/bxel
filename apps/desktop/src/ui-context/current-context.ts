/* @layer renderer-app @kind logic */
import type { BxelContext } from './bxel-context.type';
import { deriveContext } from './derive-context';
import { readContextInput } from './read-context-input';

const currentContext = (): BxelContext => deriveContext(readContextInput());

export { currentContext };
