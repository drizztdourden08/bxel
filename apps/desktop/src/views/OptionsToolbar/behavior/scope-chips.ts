/* @layer renderer-app @kind logic */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { toggleBroadcast } from '../../../sheet/toggle-broadcast';
import { OPTIONS_TEXT } from '../OptionsToolbar.constants';
import type { ScopeInput } from '../OptionsToolbar.type';

const scopeChips = (input: ScopeInput): ToolbarItem[] => {
  const chips: ToolbarItem[] = [];
  if (input.surface === 'tile' && input.tileUses !== null) {
    const caption = OPTIONS_TEXT.editsEveryUse(input.tileUses);
    chips.push({ kind: 'button', id: 'tile-uses', label: caption, description: OPTIONS_TEXT.editsEveryUseDescription, icon: 'info', caption, disabled: true, onSelect: () => undefined });
  }
  if (input.surface === 'sprite' && input.broadcast && input.selected > 1) {
    const caption = OPTIONS_TEXT.paintingSprites(input.selected);
    chips.push({ kind: 'button', id: 'painting-sprites', label: caption, description: OPTIONS_TEXT.paintingDescription, icon: 'info', caption, onSelect: toggleBroadcast });
  }
  return chips;
};

export { scopeChips };
