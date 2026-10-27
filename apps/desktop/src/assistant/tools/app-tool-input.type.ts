/* @layer renderer-app @kind types */
import type { SET_VIEW_INPUT_SCHEMA } from '@bxel/mcp';
import type { z } from 'zod';

type ListCommandsInput = {
  readonly area?: string;
  readonly query?: string;
  readonly includeDisabled: boolean;
};

type RunCommandInput = {
  readonly id: string;
  readonly args?: Record<string, unknown>;
  readonly revision?: number;
  readonly show: boolean;
};

type SetViewInput = z.infer<typeof SET_VIEW_INPUT_SCHEMA>;

type GetHistoryInput = { readonly documentId: string; readonly limit: number };

type Runs = readonly (readonly [number, number, number])[];

export type { GetHistoryInput, ListCommandsInput, RunCommandInput, Runs, SetViewInput };
