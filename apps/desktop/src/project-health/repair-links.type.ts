/* @layer renderer-app @kind types */
import type { AssetRef } from '@bxel/document';

type Decision = { readonly link: AssetRef | null } | { readonly reason: string };

export type { Decision };
