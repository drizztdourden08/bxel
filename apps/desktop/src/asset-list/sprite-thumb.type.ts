/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';

type Thumb = { readonly bank: PaletteBank | undefined; readonly url: string | null };

export type { Thumb };
