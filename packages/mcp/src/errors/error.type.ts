/* @layer core @kind types */
import type { z } from 'zod';
import type { FAILURE_SCHEMA } from '../schema/failure.constants';
import type { MCP_ERROR_CODE } from './mcp-error-code.constants';
import type { RETRY_VALUES } from './retry.constants';

type Retry = (typeof RETRY_VALUES)[number];

type McpErrorCode = (typeof MCP_ERROR_CODE)[keyof typeof MCP_ERROR_CODE];

type Failure = z.infer<typeof FAILURE_SCHEMA>;

type FailureError = Failure['error'];

type FailureDetail = FailureError['details'][number];

type FailureSince = NonNullable<FailureError['since']>[number];

type FailureExtra = {
  readonly step?: number;
  readonly path?: string;
  readonly details?: readonly FailureDetail[];
  readonly retry?: Retry;
  readonly currentRevision?: number;
  readonly since?: readonly FailureSince[];
};

type McpResult<T> = { readonly ok: true; readonly value: T } | Failure;

export type { Failure, FailureDetail, FailureError, FailureExtra, FailureSince, McpErrorCode, McpResult, Retry };
