/* @layer renderer-app @kind logic */
import { canSee } from '@bxel/mcp';
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { ToolContext } from '../assistant.type';

const visibleRecent = (context: ToolContext): Promise<RecentDocument[]> =>
  canSee(context.settings.assistantSee, 'recent_file') ? context.documents.recent() : Promise.resolve([]);

export { visibleRecent };
