/* @layer electron-main @kind types */
import type { CallSession, HelloClient, InstanceWindow, SessionMode, SessionView } from '@bxel/mcp';
import type { FileKind } from '@bxel/project';
import type { MainContext } from '@drizztdourden08/brock-electron/main';

type LiveSession = CallSession & {
  readonly token: string;
  readonly connectionId: string;
  readonly launchedThis: boolean;
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
  readonly sessions: SessionTable;
  readonly instance: InstanceState;
};

type SessionLink = {
  readonly connectionId: string;
  readonly client: HelloClient;
  readonly launchedThis: boolean;
};

type WantedFile = {
  readonly name: string;
  readonly kind: FileKind;
  readonly overwrite: boolean;
  readonly path: string;
};

export type { AssistantMain, InstanceState, LiveSession, SessionLink, SessionTable, WantedFile };
