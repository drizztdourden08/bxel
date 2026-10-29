/* @layer core @kind types */
import type { Ink } from './ink.type';

type PlacementInk = Extract<Ink, { kind: 'behind' | 'lockAlpha' | 'onlyColour' }>;

export type { PlacementInk };
