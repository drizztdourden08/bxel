/* @layer renderer-app @kind logic */
import { canSee } from '@bxel/mcp';
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { ToolContext } from '../assistant.type';
import { hiddenCover } from './hidden-cover';
import { insideCover } from './inside-cover';

const visibleRecent = async (context: ToolContext): Promise<RecentDocument[]> => {
  if (!canSee(context.settings.assistantSee, 'recent_file')) return [];
  const cover = hiddenCover(context);
  const recent = await context.documents.recent();
  return recent.filter((entry) => !insideCover(cover, entry.path));
};

export { visibleRecent };
