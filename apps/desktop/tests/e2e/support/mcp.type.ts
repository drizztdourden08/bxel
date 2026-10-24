/* @layer renderer-app @kind types */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';

type ClientConfig = {
  readonly command: string;
  readonly args: readonly string[];
  readonly env: Readonly<Record<string, string>>;
};

type McpLink = {
  readonly client: Client;
  readonly stderr: () => string;
  readonly close: () => Promise<void>;
};

type Structured = Readonly<Record<string, unknown>>;

type CallOutcome = {
  readonly ok: boolean;
  readonly data: Structured;
  readonly code: string | null;
  readonly isError: boolean;
};

export type { CallOutcome, ClientConfig, McpLink, Structured };
