/* @layer renderer-app @kind component */
import { ToggleGroup } from '@drizztdourden08/tessera';
import { changedAxes } from '../../../editor/changed-axes';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { useToolStore } from '../../../stores/useToolStore';
import { optionTooltip, useCommandKeys } from '../../ActionHint';
import { CONTEXT_TEXT, MIRROR_X_HINT, MIRROR_Y_HINT } from '../ContextBar.constants';

const SymmetryOptions = () => {
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const xKeys = useCommandKeys(MIRROR_X_HINT.shortcuts?.[0]?.command)[0];
  const yKeys = useCommandKeys(MIRROR_Y_HINT.shortcuts?.[0]?.command)[0];
  const active: SymmetryAxis[] = [...(x ? (['x'] as const) : []), ...(y ? (['y'] as const) : [])];
  return (
    <ToggleGroup<SymmetryAxis>
      size="sm"
      label={CONTEXT_TEXT.symmetry}
      value={active}
      options={[
        { value: 'x', label: MIRROR_X_HINT.name, tooltip: optionTooltip(MIRROR_X_HINT, xKeys) },
        { value: 'y', label: MIRROR_Y_HINT.name, tooltip: optionTooltip(MIRROR_Y_HINT, yKeys) },
      ]}
      onChange={(next) => changedAxes(active, next).forEach(toggle)}
    />
  );
};

export { SymmetryOptions };
