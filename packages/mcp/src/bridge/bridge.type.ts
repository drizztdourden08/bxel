/* @layer core @kind types */
import type { z } from 'zod';
import type { TOOL_NAME } from '../tools/tool-name.constants';
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

export type { ByeRequest, HelloReply, HelloRequest, McpAsk, McpRoute, PairAnswer, PairInfo, ToolRouteName };
