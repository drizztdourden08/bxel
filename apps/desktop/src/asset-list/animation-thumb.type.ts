/* @layer renderer-app @kind types */
import type { PaletteBank, Sprite } from '@bxel/document';

type AnimationThumb = { readonly bank: PaletteBank | undefined; readonly sprite: Sprite | undefined; readonly url: string | null };

export type { AnimationThumb };
