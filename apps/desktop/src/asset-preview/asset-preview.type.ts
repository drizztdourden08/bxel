/* @layer renderer-app @kind types */
import type { AnimDirection } from '@bxel/document';

type PlaybackLoop = { readonly direction: AnimDirection; readonly repeat: number };

type PreviewMode = 'compact' | 'large';

export type { PlaybackLoop, PreviewMode };
