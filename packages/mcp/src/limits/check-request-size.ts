/* @layer core @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Failure } from '../errors/error.type';
import { mcpFailure } from '../errors/mcp-failure';
import { REQUEST_BUDGET_BYTES } from './limits.constants';

const checkRequestSize = (request: unknown): Failure | null => {
  const text = JSON.stringify(request);
  const bytes = new TextEncoder().encode(text).length;
  if (bytes <= REQUEST_BUDGET_BYTES) return null;
  return mcpFailure(
    ERROR_CODE.BATCH_TOO_LARGE,
    `The request is ${bytes} bytes; the most one call may carry is ${REQUEST_BUDGET_BYTES}. Split the batch.`,
  );
};

export { checkRequestSize };
