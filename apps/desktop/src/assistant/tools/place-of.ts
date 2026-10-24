/* @layer renderer-app @kind logic */
import type { ToolContext } from '../assistant.type';
import { inFolder } from './in-folder';
import { projectPlace } from './project-place';
import { recentIdOf } from './recent-id-of';

const placeOf = (context: ToolContext, path: string | undefined): unknown => {
  if (path === undefined) return null;
  if (inFolder(path, context.call.folder)) return { assistantFolder: true };
  return projectPlace(context, path) ?? { recentId: recentIdOf(path) };
};

export { placeOf };
