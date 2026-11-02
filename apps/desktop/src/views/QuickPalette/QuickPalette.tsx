/* @layer renderer-app @kind component */
import { PointerPalette } from '@drizztdourden08/tessera';
import { activeMember } from '../../editor/tool-pick/active-member';
import { QUICK_TEXT } from '../../editor/quick-palette/quick-palette.constants';
import { quickId } from '../../editor/quick-palette/make-quick-id';
import { pickQuick } from '../../editor/quick-palette/pick-quick';
import { useQuickPaletteStore } from '../../stores/useQuickPaletteStore';
import { useLastPointer } from './behavior/useLastPointer';
import { useQuickSections } from './behavior/useQuickSections';

const QuickPalette = () => {
  const open = useQuickPaletteStore((state) => state.open);
  const at = useQuickPaletteStore((state) => state.at);
  const sections = useQuickSections();
  useLastPointer();
  const active = activeMember();
  return (
    <PointerPalette
      aria-label={QUICK_TEXT.region}
      open={open}
      at={at}
      sections={sections}
      value={active ? quickId('tool', active.id) : null}
      onPick={pickQuick}
      onClose={() => useQuickPaletteStore.getState().close()}
    />
  );
};

export { QuickPalette };
