/* @layer renderer-app @kind types */
import type { Point } from '@bxel/raster';
import type { EditorTarget } from '../../../editor/editor.type';
import type { PressPlan } from '../../../editor/press-plan.type';

type Instant = { readonly plan: PressPlan; readonly target: EditorTarget; readonly at: Point };

export type { Instant };
