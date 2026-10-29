/* @layer renderer-app @kind logic */
import type { Slice } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { useSliceToolStore } from '../stores/useSliceToolStore';

const selectedSlice = (): Slice | null => {
  const { selected } = useSliceToolStore.getState();
  return selected === null ? null : (currentTarget()?.sprite.slices.find((slice) => slice.id === selected) ?? null);
};

export { selectedSlice };
