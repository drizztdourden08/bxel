/* @layer renderer-app @kind types */
import type { SpriteRig } from './sprite-rig.type';

type TransformRig = SpriteRig & { readonly original: Uint8Array };

export type { TransformRig };
