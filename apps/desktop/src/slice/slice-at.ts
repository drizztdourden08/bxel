/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import { currentTarget } from '../editor/current-target';

const slices = (): readonly Slice[] => currentTarget()?.sprite.slices ?? [];

const sliceAt = (at: { x: number; y: number }): Slice | null =>
  [...slices()].reverse().find((slice) => at.x >= slice.rect.x && at.y >= slice.rect.y && at.x < slice.rect.x + slice.rect.width && at.y < slice.rect.y + slice.rect.height) ?? null;

export { sliceAt };
