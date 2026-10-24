/* @layer renderer-app @kind logic */
import { checkWrite } from '@bxel/mcp';
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { grantedProjects } from './granted-projects';
import { projectEntry } from './project-entry';
import { recentIdOf } from './recent-id-of';
import { reply } from './reply';
import { ASSISTANT_FOLDER_NAME, FILE_KIND_OF } from './tools.constants';
import { visibleRecent } from './visible-recent';

const kindOf = (name: string) => FILE_KIND_OF[name.split('.').at(-1)?.toLowerCase() ?? ''] ?? 'other';

const recentEntry = (context: ToolContext) => (entry: RecentDocument) => ({
  recentId: recentIdOf(entry.path),
  fileName: entry.name,
  kind: kindOf(entry.name),
  openedAt: new Date(entry.lastOpened).toISOString(),
  documentId: context.paths.documentAt(entry.path) ?? null,
});

const listPlaces: ToolHandler = async (_input, context) => {
  const recent = await visibleRecent(context);
  return reply({
    ok: true,
    projects: grantedProjects(context).map((granted) => projectEntry(granted, context.call.session.mode)),
    recent: recent.map(recentEntry(context)),
    assistantFolder: { name: ASSISTANT_FOLDER_NAME, writable: checkWrite(context.settings.assistantWrite, 'assistant_folder') === null },
  });
};

export { listPlaces };
