/* @layer renderer-app @kind component */
import { ToggleGroup } from '@drizztdourden08/tessera';
import { changedAxes } from '../../../editor/changed-axes';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { useToolStore } from '../../../stores/useToolStore';
import { CONTEXT_TEXT } from '../ContextBar.constants';

const SymmetryOptions = () => {
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const active: SymmetryAxis[] = [...(x ? (['x'] as const) : []), ...(y ? (['y'] as const) : [])];
  return (
    <ToggleGroup<SymmetryAxis>
      size="sm"
      label={CONTEXT_TEXT.symmetry}
      value={active}
      options={[
        { value: 'x', label: CONTEXT_TEXT.mirrorX },
        { value: 'y', label: CONTEXT_TEXT.mirrorY },
      ]}
      onChange={(next) => changedAxes(active, next).forEach(toggle)}
    />
  );
};

export { SymmetryOptions };
