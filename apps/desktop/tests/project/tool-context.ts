/* @layer renderer-app @kind test */
import { grantOfMode } from '@bxel/mcp';
import type { SessionMode, ToolCall } from '@bxel/mcp';
import type { ProjectGrant } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { ASSISTANT_DEFAULTS } from '../../src/assistant/assistant.constants';
import type { AssistantSettings, ToolContext } from '../../src/assistant/assistant.type';
import type { DocumentHost } from '../../src/documents/document-host.type';
import type { PathBook } from '../../src/files/files.type';

type ContextParts = {
  readonly host: DocumentHost;
  readonly paths: PathBook;
  readonly documents: DocumentsPort;
  readonly call?: Partial<ToolCall>;
};

const toolContext = (parts: ContextParts, grants: readonly ProjectGrant[] = [], mode: SessionMode = 'edit', overrides: Partial<AssistantSettings> = {}): ToolContext => ({
  call: {
    tool: 'list_places',
    input: {},
    session: { sessionId: 's1', mode, grant: grantOfMode(mode), trust: 'prompted', client: { name: 'check', version: null }, displayName: 'Check' },
    instance: { window: 'visible', launchedBy: 'owner', canStop: false },
    target: null,
    folder: 'C:/Assistant',
    version: '0.0.0',
    ...parts.call,
  },
  host: parts.host,
  settings: { ...ASSISTANT_DEFAULTS, assistantAccess: true, assistantProjects: grants, ...overrides },
  documents: parts.documents,
  paths: parts.paths,
  claim: (paths) => Promise.resolve(paths),
});

export { toolContext };
