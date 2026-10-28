/* @layer renderer-app @kind logic */
import type { MenuGroup } from '@drizztdourden08/tessera';
import { openAssetSettings } from '../../../config-entry/open-asset-settings';
import { SWATCH_SIZES } from '../../../palette-view/palette-view.constants';
import { OVERFLOW_TEXT, PALETTE_MENU } from '../PalettePanel.constants';
import type { PanelModel } from '../PalettePanel.type';
import { PANEL_COMMAND } from '../../../palette-panel/palette-panel.constants';
import { addColour } from './add-colour';
import { ruledOff } from './ruled-off';
import { openRampBuilder } from './open-ramp-builder';
import { openSheet } from './open-sheet';
import { selectUnused } from './select-unused';
import { sortItems } from './sort-items';

const overflowGroups = (panel: PanelModel): MenuGroup[] => {
  const { view, lock, target } = panel;
  const full = target.bank.slots.length >= target.bank.cap;
  return [
    {
      id: 'make',
      items: [
        { id: 'add', label: PALETTE_MENU.addColour, icon: 'plus', disabled: lock.locked || full || ruledOff(PANEL_COMMAND.add), onSelect: () => addColour(panel) },
        { id: 'ramp', label: PALETTE_MENU.newRamp, icon: 'pixel-shade', disabled: lock.locked || ruledOff(PANEL_COMMAND.ramp), onSelect: () => openRampBuilder(panel) },
        { id: 'sort', label: OVERFLOW_TEXT.sort, children: sortItems(panel, 'ascending') },
        { id: 'sort-down', label: OVERFLOW_TEXT.sortDown, children: sortItems(panel, 'descending') },
      ],
    },
    {
      id: 'clean',
      items: [
        { id: 'find-unused', label: OVERFLOW_TEXT.findUnused, onSelect: () => selectUnused(panel) },
        { id: 'remove-unused', label: PALETTE_MENU.removeUnused, disabled: lock.locked || ruledOff(PANEL_COMMAND.unused), onSelect: () => openSheet(panel, 'unused') },
        { id: 'unite', label: PALETTE_MENU.unite, disabled: lock.locked || panel.duplicates.length === 0 || ruledOff(PANEL_COMMAND.duplicates), onSelect: () => openSheet(panel, 'duplicates') },
      ],
    },
    {
      id: 'show',
      items: [
        { id: 'show-use', label: OVERFLOW_TEXT.showUse, kind: 'check', checked: view.showUse, onSelect: () => view.change({ showUse: !view.showUse }) },
        {
          id: 'scope',
          label: OVERFLOW_TEXT.scope,
          children: [
            { id: 'scope-sprite', label: OVERFLOW_TEXT.scopeSprite, kind: 'radio', checked: view.scope === 'sprite', onSelect: () => view.change({ scope: 'sprite', showUse: true }) },
            { id: 'scope-palette', label: OVERFLOW_TEXT.scopePalette, kind: 'radio', checked: view.scope === 'palette', onSelect: () => view.change({ scope: 'palette', showUse: true }) },
          ],
        },
        {
          id: 'size',
          label: OVERFLOW_TEXT.size,
          children: SWATCH_SIZES.map((size) => ({ id: `size-${size}`, label: OVERFLOW_TEXT.sizeOf(size), kind: 'radio', checked: view.size === size, onSelect: () => view.change({ size }) })),
        },
        { id: 'settings', label: PALETTE_MENU.settings, icon: 'settings', onSelect: () => openAssetSettings('palette') },
      ],
    },
  ];
};

export { overflowGroups };
