/* @layer renderer-app @kind logic */
import type { FileKit } from '../../files/files.type';
import type { ToolContext } from '../assistant.type';

const toolKit = (context: ToolContext): FileKit => ({
  documents: context.documents,
  host: context.host,
  paths: context.paths,
  clock: () => Date.now(),
  focus: () => undefined,
});

export { toolKit };
