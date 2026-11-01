/* @layer renderer-app @kind types */
import type { ViewStep } from './view-steps.type';

type TilesetPatch = NonNullable<Parameters<ViewStep>[0]['tileset']>;

export type { TilesetPatch };
