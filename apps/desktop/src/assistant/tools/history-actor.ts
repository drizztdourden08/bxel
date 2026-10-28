/* @layer renderer-app @kind logic */
import type { ToolContext } from '../assistant.type';
import { OWNER } from './get-history.constants';

const historyActor = (context: ToolContext, entry: { readonly origin: 'ui' | 'mcp'; readonly actor: string }): string => {
  if (entry.origin === 'ui') return OWNER;
  return entry.actor === context.call.session.sessionId ? context.call.session.displayName : entry.actor;
};

export { historyActor };
