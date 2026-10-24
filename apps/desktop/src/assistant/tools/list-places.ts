/* @layer renderer-app @kind logic */
import { checkWrite } from '@bxel/mcp';
import { entryKindOf } from '@bxel/project';
import type { RecentDocument } from '@drizztdourden08/brock-core';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { documentAt } from './document-at';
import { grantedProjects } from './granted-projects';
import { projectEntry } from './project-entry';
import { recentIdOf } from './recent-id-of';
import { reply } from './reply';
import { ASSISTANT_FOLDER_NAME, WIRE_KIND_OF } from './tools.constants';
import { visibleRecent } from './visible-recent';

const kindOf = (name: string) => WIRE_KIND_OF[entryKindOf(name)];

const recentEntry = (context: ToolContext) => (entry: RecentDocument) => ({
  recentId: recentIdOf(entry.path),
  fileName: entry.name,
  kind: kindOf(entry.name),
  openedAt: new Date(entry.lastOpened).toISOString(),
  documentId: documentAt(context, entry.path),
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
