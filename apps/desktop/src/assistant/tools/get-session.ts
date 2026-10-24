/* @layer renderer-app @kind logic */
import { CONTRACT_VERSION, MCP_LIMITS } from '@bxel/mcp';
import { APP_COMMANDS } from '../../documents/document-host.constants';
import { ASSISTANT_FOLDER_LABEL, EXPORT_FORMATS } from '../assistant.constants';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';

const getSession: ToolHandler = (_input, { call, settings }) =>
  reply({
    ok: true,
    sessionId: call.session.sessionId,
    mode: call.session.mode,
    client: call.session.client,
    trust: call.session.trust,
    instance: call.instance,
    scope: { see: settings.assistantSee, write: settings.assistantWrite },
    bxelVersion: call.version,
    contract: CONTRACT_VERSION,
    assistantFolder: ASSISTANT_FOLDER_LABEL,
    exportFormats: [...EXPORT_FORMATS],
    commands: APP_COMMANDS.map((command) => command.name),
    limits: MCP_LIMITS,
  });

export { getSession };
