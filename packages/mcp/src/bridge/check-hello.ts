/* @layer core @kind logic */
import type { McpResult } from '../errors/error.type';
import { inputFailure } from '../errors/input-failure';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import { CONTRACT_VERSION } from './bridge.constants';
import type { HelloRequest } from './bridge.type';
import { HELLO_SCHEMA } from './hello.constants';

const checkHello = (raw: unknown): McpResult<HelloRequest> => {
  const parsed = HELLO_SCHEMA.safeParse(raw);
  if (!parsed.success) return inputFailure(parsed.error);
  if (parsed.data.contract === CONTRACT_VERSION) return { ok: true, value: parsed.data };
  return mcpFailure(
    MCP_ERROR_CODE.HELPER_OUTDATED,
    `This helper speaks contract ${parsed.data.contract}; Bxel speaks ${CONTRACT_VERSION}. Copy the client config again.`,
  );
};

export { checkHello };
