/* @layer renderer-app @kind component */
import { currentTarget } from '../../editor/current-target';
import { useSliceToolStore } from '../../stores/useSliceToolStore';
import { SliceContent } from './sub-components/SliceContent';

const SliceDialog = () => {
  const open = useSliceToolStore((state) => state.dialog);
  const slice = open === null ? null : (currentTarget()?.sprite.slices.find((each) => each.id === open) ?? null);
  return slice ? <SliceContent key={slice.id} slice={slice} /> : null;
};

export { SliceDialog };
