/* @layer renderer-app @kind types */
import type { z } from 'zod';
import type { LAYOUT_OP_SCHEMA } from '@bxel/mcp';

type LayoutOp = z.infer<typeof LAYOUT_OP_SCHEMA>;

type Runners = { readonly [K in LayoutOp['op']]: (op: Extract<LayoutOp, { op: K }>) => void };

export type { LayoutOp, Runners };
