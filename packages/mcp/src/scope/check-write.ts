/* @layer core @kind logic */
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import { WRITE_ALLOWS } from './scope.constants';
import type { WriteScope, WriteTarget } from './scope.type';

const checkWrite = (scope: WriteScope, target: WriteTarget): Failure | null =>
  WRITE_ALLOWS[scope].includes(target)
    ? null
    : mcpFailure(MCP_ERROR_CODE.WRITE_NOT_ALLOWED, 'The "assistant can write" setting does not cover this place.');

export { checkWrite };
