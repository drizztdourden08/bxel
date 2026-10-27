/* @layer renderer-app @kind logic */
import type { ToolHandlers } from './assistant.type';
import { guardHandler } from './guard-handler';

const guardHandlers = (handlers: ToolHandlers): ToolHandlers =>
  Object.fromEntries(Object.entries(handlers).map(([name, handler]) => [name, guardHandler(handler)]));

export { guardHandlers };
