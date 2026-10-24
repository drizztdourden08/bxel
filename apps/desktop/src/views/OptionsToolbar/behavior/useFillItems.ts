/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { FILL_MODES } from '../../../editor/tools.constants';
import { useToolStore } from '../../../stores/useToolStore';
import { choose, hintChoice } from '../../../toolbar-items';
import { FILL_HINTS, FILL_ICONS, OPTIONS_TEXT } from '../OptionsToolbar.constants';
import { neighbourItem } from './neighbour-item';

const useFillItems = (): ToolbarItem[] => {
  const mode = useToolStore((state) => state.fillMode);
  const connectivity = useToolStore((state) => state.connectivity);
  const setMode = useToolStore((state) => state.setFillMode);
  const setConnectivity = useToolStore((state) => state.setConnectivity);
  return [
    {
      kind: 'group',
      id: 'fill-mode',
      label: OPTIONS_TEXT.fillMode,
      value: mode,
      choices: FILL_MODES.map((each) => hintChoice(each, FILL_ICONS[each], FILL_HINTS[each])),
      onChange: choose(FILL_MODES, setMode),
    },
    neighbourItem('fill-neighbours', OPTIONS_TEXT.neighbours, connectivity, setConnectivity),
  ];
};

export { useFillItems };
