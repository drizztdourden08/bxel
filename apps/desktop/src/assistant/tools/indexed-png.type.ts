/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';

type IndexedPicture = { readonly indices: Uint8Array; readonly width: number; readonly height: number; readonly bank: PaletteBank };

export type { IndexedPicture };
