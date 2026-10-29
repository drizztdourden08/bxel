/* @layer core @kind logic */
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';

const turnedOff = (message: string, step: number | null = null): Failure =>
  mcpFailure(MCP_ERROR_CODE.TOOL_DISABLED, message, step === null ? {} : { step });

export { turnedOff };
