/* @layer renderer-app @kind logic */
import type { FileKit } from '../../files/files.type';
import { guardDocuments } from '../../prompts/guard-documents';
import { refusingPrompts } from '../../prompts/refusing-prompts';
import type { ToolContext } from '../assistant.type';

const toolKit = (context: ToolContext): FileKit => ({
  documents: guardDocuments(context.documents),
  prompts: refusingPrompts(),
  host: context.host,
  paths: context.paths,
  clock: () => Date.now(),
  focus: () => undefined,
});

export { toolKit };
