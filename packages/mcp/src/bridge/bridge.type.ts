/* @layer core @kind types */
import type { z } from 'zod';
import type { Failure } from '../errors/error.type';
import type { Grant } from '../grants/grant.type';
import type { ToolOutcome } from '../tools/tool-result.type';
import type { ToolName } from '../tools/tool.type';
import type { TOOL_NAME } from '../tools/tool-name.constants';
import type { HelloClient, SessionMode, TrustSource } from '../trust/trust.type';
import type { BYE_SCHEMA, HELLO_REPLY_SCHEMA, HELLO_SCHEMA, PAIR_ANSWER_SCHEMA, PAIR_INFO_SCHEMA } from './hello.constants';
import type { MCP_ASK, MCP_ROUTE } from './bridge.constants';

type ToolRouteName = Exclude<(typeof TOOL_NAME)[keyof typeof TOOL_NAME], 'start_bxel'>;

type McpRoute = (typeof MCP_ROUTE)[keyof typeof MCP_ROUTE];

type McpAsk = (typeof MCP_ASK)[keyof typeof MCP_ASK];

type HelloRequest = z.infer<typeof HELLO_SCHEMA>;

type HelloReply = z.infer<typeof HELLO_REPLY_SCHEMA>;

type ByeRequest = z.infer<typeof BYE_SCHEMA>;

type PairInfo = z.infer<typeof PAIR_INFO_SCHEMA>;

type PairAnswer = z.infer<typeof PAIR_ANSWER_SCHEMA>;

type SessionTrust = 'prompted' | TrustSource;

type InstanceWindow = 'headless' | 'visible';

type LaunchedBy = 'this_helper' | 'other_helper' | 'owner';

type ToolReply = {
  readonly outcome: ToolOutcome;
  readonly images: readonly string[];
};

type PairRequest = {
  readonly client: HelloClient;
  readonly headless: boolean;
};

type PairOutcome = { readonly ok: true; readonly mode: SessionMode; readonly grant: Grant; readonly trust: SessionTrust } | Failure;

type InstanceView = {
  readonly window: InstanceWindow;
  readonly launchedBy: LaunchedBy;
  readonly canStop: boolean;
};

type CallSession = {
  readonly sessionId: string;
  readonly mode: SessionMode;
  readonly grant: Grant;
  readonly trust: SessionTrust;
  readonly client: HelloClient;
  readonly displayName: string;
};

type ToolCall = {
  readonly tool: ToolName;
  readonly input: unknown;
  readonly session: CallSession;
  readonly instance: InstanceView;
  readonly target: string | null;
  readonly folder: string;
  readonly version: string;
};

type SessionView = CallSession & {
  readonly connectedAt: number;
  readonly lastCallAt: number;
};

type FlushReport = {
  readonly unsaved: readonly { readonly documentId: string; readonly name: string }[];
};

export type {
  ByeRequest,
  CallSession,
  FlushReport,
  HelloReply,
  HelloRequest,
  InstanceView,
  InstanceWindow,
  LaunchedBy,
  McpAsk,
  McpRoute,
  PairAnswer,
  PairInfo,
  PairOutcome,
  PairRequest,
  SessionTrust,
  SessionView,
  ToolCall,
  ToolReply,
  ToolRouteName,
};
