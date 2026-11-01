/* @layer renderer-app @kind types */
import type { AnimSpanTag, TagId } from '@bxel/document';

type TagRef = { by: 'id'; id: TagId } | { by: 'name'; name: string; facing?: NonNullable<AnimSpanTag['facing']> };

export type { TagRef };
