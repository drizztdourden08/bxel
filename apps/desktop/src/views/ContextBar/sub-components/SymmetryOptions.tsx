/* @layer renderer-app @kind component */
import { ToggleGroup } from '@drizztdourden08/tessera';
import { changedAxes } from '../../../editor/changed-axes';
import type { SymmetryAxis } from '../../../stores/tool-store.type';
import { useToolStore } from '../../../stores/useToolStore';
import { ActionHint, hintOf, useChoiceHint } from '../../ActionHint';
import { CONTEXT_TEXT, MIRROR_HINTS, MIRROR_X_HINT, MIRROR_Y_HINT } from '../ContextBar.constants';

const SymmetryOptions = () => {
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const choice = useChoiceHint(MIRROR_HINTS);
  const active: SymmetryAxis[] = [...(x ? (['x'] as const) : []), ...(y ? (['y'] as const) : [])];
  return (
    <ActionHint hint={choice.spec}>
      <ToggleGroup<SymmetryAxis>
        size="sm"
        label={CONTEXT_TEXT.symmetry}
        value={active}
        options={[
          { value: 'x', label: MIRROR_X_HINT.name, hint: hintOf(MIRROR_X_HINT) },
          { value: 'y', label: MIRROR_Y_HINT.name, hint: hintOf(MIRROR_Y_HINT) },
        ]}
        onHint={choice.onHint}
        onChange={(next) => changedAxes(active, next).forEach(toggle)}
      />
    </ActionHint>
  );
};

export { SymmetryOptions };
