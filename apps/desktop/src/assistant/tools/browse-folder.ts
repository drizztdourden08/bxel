/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { BrowseFolder } from './browse-folder.type';
import { locationPath } from './location-path';
import { reply } from './reply';

const browseFolder = (goTo: (folder: string | null) => void, requested: BrowseFolder, context: ToolContext): ToolReply | null => {
  if (requested === undefined) return null;
  if (requested === null) {
    goTo(null);
    return null;
  }
  const folder = locationPath(context, requested, 'browse.folder');
  if (!folder.ok) return reply(folder);
  goTo(folder.value);
  return null;
};

export { browseFolder };
