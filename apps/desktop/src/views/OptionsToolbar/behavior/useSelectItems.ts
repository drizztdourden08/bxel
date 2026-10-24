/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { resizeSelection } from '../../../editor/selection/resize-selection';
import { SELECT_MODES, SELECT_VARIANTS } from '../../../editor/selection/selection.constants';
import { SELECT_VARIANT_ICONS } from '../../../icons/tool-icons.constants';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { buttonItem, choose, hintChoice } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import {
  EXPAND_HINT, OPTIONS_TEXT, SELECT_MODE_HINTS, SELECT_MODE_ICONS, SELECT_VARIANT_HINTS, SHRINK_HINT,
} from '../OptionsToolbar.constants';
import { neighbourItem } from './neighbour-item';

const useSelectItems = (): ToolbarItem[] => {
  const variant = useSelectionStore((state) => state.variant);
  const mode = useSelectionStore((state) => state.mode);
  const connectivity = useSelectionStore((state) => state.connectivity);
  const setVariant = useSelectionStore((state) => state.setVariant);
  const setMode = useSelectionStore((state) => state.setMode);
  const setConnectivity = useSelectionStore((state) => state.setConnectivity);
  const expandKeys = useHintKeys(EXPAND_HINT);
  const shrinkKeys = useHintKeys(SHRINK_HINT);
  return [
    {
      kind: 'group',
      id: 'select-variant',
      label: OPTIONS_TEXT.selectVariant,
      value: variant,
      choices: SELECT_VARIANTS.map((each) => hintChoice(each, SELECT_VARIANT_ICONS[each], SELECT_VARIANT_HINTS[each])),
      onChange: choose(SELECT_VARIANTS, setVariant),
    },
    {
      kind: 'group',
      id: 'select-mode',
      label: OPTIONS_TEXT.selectMode,
      value: mode,
      choices: SELECT_MODES.map((each) => hintChoice(each, SELECT_MODE_ICONS[each], SELECT_MODE_HINTS[each])),
      onChange: choose(SELECT_MODES, setMode),
    },
    ...(variant === 'wand' ? [neighbourItem('wand-neighbours', OPTIONS_TEXT.wandNeighbours, connectivity, setConnectivity)] : []),
    buttonItem({ id: 'select-expand', icon: 'maximize-2', hint: EXPAND_HINT, keys: expandKeys, caption: OPTIONS_TEXT.expandCaption, onSelect: () => resizeSelection(1) }),
    buttonItem({ id: 'select-shrink', icon: 'minimize-2', hint: SHRINK_HINT, keys: shrinkKeys, caption: OPTIONS_TEXT.shrinkCaption, onSelect: () => resizeSelection(-1) }),
  ];
};

export { useSelectItems };
