/* @layer renderer-app @kind types */
import type {
  SeeScope,
  SessionMode,
  ToolCall,
  ToolName,
  ToolReply,
  TrustEntry,
  TrustLevel,
  WriteScope,
} from '@bxel/mcp';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { DocumentHost } from '../documents/document-host.type';
import type { PathBook } from '../files/files.type';

interface AssistantSettings {
  assistantAccess: boolean;
  assistantStart: boolean;
  assistantLevel: TrustLevel;
  assistantAllowAllMode: SessionMode;
  assistantPrograms: readonly TrustEntry[];
  assistantSee: SeeScope;
  assistantWrite: WriteScope;
  assistantFolder: string;
}

type ClientConfig = {
  readonly command: string;
  readonly args: readonly string[];
  readonly env: Readonly<Record<string, string>>;
};

type AssistantSetup = {
  readonly access: boolean;
  readonly start: boolean;
  readonly folder: string;
};

type ActivityEntry = {
  readonly at: number;
  readonly client: string;
  readonly tool: ToolName;
  readonly documentId: string | null;
  readonly code: string;
  readonly revisionBefore: number | null;
  readonly revisionAfter: number | null;
  readonly durationMs: number;
};

type SettingsPort = {
  readonly read: () => AssistantSettings;
  readonly patch: (patch: Partial<AssistantSettings>) => void;
};

type ToolContext = {
  readonly call: ToolCall;
  readonly host: DocumentHost;
  readonly settings: AssistantSettings;
  readonly documents: DocumentsPort;
  readonly paths: PathBook;
};

type ToolHandler = (input: unknown, context: ToolContext) => ToolReply | Promise<ToolReply>;

type ToolHandlers = Readonly<Partial<Record<ToolName, ToolHandler>>>;

export type { ActivityEntry, AssistantSettings, AssistantSetup, ClientConfig, SettingsPort, ToolContext, ToolHandler, ToolHandlers };
