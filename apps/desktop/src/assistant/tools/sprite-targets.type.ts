/* @layer renderer-app @kind types */
import type { Sprite } from '@bxel/document';

type Targets = { readonly ok: true; readonly sprites: readonly Sprite[] } | { readonly ok: false; readonly problem: string };

export type { Targets };
