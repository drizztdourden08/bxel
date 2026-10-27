/* @layer helper @kind types */
import type { Grant, HelloClient, ToolReply, ToolRouteName, ToolSpec } from '@bxel/mcp';
import type { ChildProcess } from 'child_process';

type BridgeSession = {
  readonly call: (tool: ToolRouteName, input: unknown) => Promise<ToolReply>;
  readonly bye: () => Promise<void>;
  readonly setClient: (client: HelloClient) => void;
  readonly setLaunchToken: (token: string) => void;
  readonly isRunning: () => boolean;
  readonly grant: () => Grant | null;
  readonly onGrant: (listener: () => void) => void;
};

type StartedChild = {
  readonly child: ChildProcess;
  readonly exited: Promise<number | null>;
};

type HelperState = {
  readonly file: string;
  readonly session: BridgeSession;
  readonly tools: ReadonlyMap<string, ToolSpec>;
  started: StartedChild | null;
};

type DiscoveryWait = { readonly kind: 'ready' } | { readonly kind: 'exit'; readonly code: number | null } | { readonly kind: 'timeout' };

export type { BridgeSession, DiscoveryWait, HelperState, StartedChild };
