/* @layer core @kind logic */
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import { GRANT_TEXT } from './grant-text.constants';

const tooLow = (text: string, step: number | null = null): Failure =>
  mcpFailure(MCP_ERROR_CODE.READ_LEVEL, `${text} ${GRANT_TEXT.where}`, step === null ? {} : { step });

export { tooLow };
