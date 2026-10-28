/* @layer renderer-app @kind types */
import type { z } from 'zod';
import type { MASK_DESCRIPTOR_SCHEMA } from '@bxel/mcp';

type MaskDescriptor = z.output<typeof MASK_DESCRIPTOR_SCHEMA>;

export type { MaskDescriptor };
