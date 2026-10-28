/* @layer electron-main @kind types */
import type { CallSession, Grant, HelloClient, InstanceWindow, SessionMode, SessionView, ToolRouteName } from '@bxel/mcp';
import type { FileKind } from '@bxel/project';
import type { RestartHandoff } from './restart-handoff.type';
import type { BridgeServer } from '@drizztdourden08/brock-electron/bridge';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

type LiveSession = CallSession & {
  readonly token: string;
  readonly connectionId: string;
  readonly launchedThis: boolean;
  readonly granted: Grant;
  readonly programKey: string | null;
  readonly connectedAt: number;
  lastCallAt: number;
};

type SessionTable = {
  readonly add: (session: LiveSession) => void;
  readonly byToken: (token: string) => LiveSession | undefined;
  readonly isRevoked: (token: string) => boolean;
  readonly end: (token: string) => LiveSession | undefined;
  readonly endConnection: (connectionId: string) => readonly LiveSession[];
  readonly revoke: (sessionId: string) => boolean;
  readonly revokeAll: () => void;
  readonly setMode: (sessionId: string, mode: SessionMode) => boolean;
  readonly setGrant: (sessionId: string, grant: Grant, stored: boolean) => boolean;
  readonly list: () => LiveSession[];
  readonly views: () => SessionView[];
  readonly size: () => number;
};

type InstanceState = {
  window: InstanceWindow;
  readonly started: boolean;
  readonly launchToken: string | null;
};

type AssistantMain = {
  ctx: MainContext | null;
  access: boolean;
  folder: string;
  readonly sessions: SessionTable;
  readonly instance: InstanceState;
  bridge: BridgeServer | null;
  readonly synced: Map<string, string>;
  handoff: RestartHandoff | null;
};

type SessionLink = {
  readonly connectionId: string;
  readonly client: HelloClient;
  readonly launchedThis: boolean;
};

type TargetCall = {
  readonly tool: ToolRouteName;
  readonly input: unknown;
};

type WantedFile = {
  readonly name: string;
  readonly kind: FileKind;
  readonly overwrite: boolean;
  readonly path: string;
};

export type { AssistantMain, InstanceState, LiveSession, SessionLink, SessionTable, TargetCall, WantedFile };
