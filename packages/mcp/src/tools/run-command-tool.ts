/* @layer core @kind logic */
import { z } from 'zod';
import { REVISION_SCHEMA } from '../schema/ids.constants';
import { withFailure } from '../schema/with-failure';
import { defineTool } from './define-tool';
import { TOOL_NAME } from './tool-name.constants';

const runCommandTool = defineTool(TOOL_NAME.runCommand, {
  title: 'Run a command',
  description:
    'Runs one command of the Bxel window, as if the owner chose it from a menu, and the owner sees it happen. Call list_commands for the ids, the args and whether a command is on. It never waits on a dialog: a command that opens one runs straight away when its args are complete, and with show: true it opens the dialog for the owner and returns at once. At Read level only commands with effect show run.',
  input: z.strictObject({
    id: z.string().min(1).max(100),
    args: z.record(z.string(), z.unknown()).optional().describe('The args the command takes, as list_commands describes them.'),
    revision: REVISION_SCHEMA.optional().describe('For a command that edits: the revision of the active document you read. A newer one refuses the run.'),
    show: z.boolean().default(false).describe('Open the dialog of a dialog command for the owner instead of running it.'),
  }),
  output: withFailure({
    ran: z.boolean(),
    id: z.string(),
    label: z.string(),
    revision: REVISION_SCHEMA.nullable().describe('Revision of the active document after the run, or null when none is open.'),
    viewChanged: z.boolean(),
    opened: z.string().nullable().describe('Such as dialog:rotate, when the command opened something for the owner instead of running.'),
  }),
});

export { runCommandTool };
