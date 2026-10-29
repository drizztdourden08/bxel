/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { EditorTarget, SprayOptions } from './editor.type';

type SprayStart = { readonly target: EditorTarget; readonly index: number; readonly options: SprayOptions; readonly seed: number; readonly at: Point };

export type { SprayStart };
