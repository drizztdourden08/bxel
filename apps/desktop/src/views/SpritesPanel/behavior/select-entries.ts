/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { IDENTICAL_TEXT } from '../../../sheet-manager/identical-text.constants';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { SELECTION_TEXT } from '../../../sheet-manager/selection-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { SPRITE_MENU } from '../SpritesPanel.constants';
import { traitEntries } from './trait-entries';

const savedEntries = (): readonly ContextMenuEntry[] => {
  const { selections } = useManagerStore.getState();
  return [
    'sprite.save_selection',
    ...selections.map((selection) => ({ command: 'sprite.load_selection', label: selection.name, args: { name: selection.name } })),
    ...selections.map((selection) => ({ command: 'sprite.drop_selection', label: SPRITE_MENU.drop(selection.name), args: { name: selection.name } })),
  ];
};

const identicalEntries = ({ ids, facts }: Pick<CurrentManager, 'ids' | 'facts'>): ContextMenuEntry => {
  const few = unless(facts.length > 1, IDENTICAL_TEXT.none);
  return {
    label: IDENTICAL_TEXT.group,
    items: [
      { command: 'sprite.select_duplicates', label: IDENTICAL_TEXT.selectDuplicates, args: { flipped: false }, ...few },
      { command: 'sprite.select_duplicates', label: IDENTICAL_TEXT.selectDuplicatesFlipped, args: { flipped: true }, ...few },
      { command: 'sprite.compare', label: IDENTICAL_TEXT.compare, ...unless(ids.length === 2, IDENTICAL_TEXT.compareNeedTwo) },
    ],
  };
};

const selectEntries = (manager: CurrentManager): ContextMenuEntry => ({
  label: MANAGER_TEXT.groups.select,
  items: [
    { command: 'sprite.select_visible', label: MANAGER_TEXT.selectAll },
    { command: 'sprite.select_none', label: MANAGER_TEXT.selectNone, ...unless(manager.scene.selected.length > 0, MANAGER_TEXT.none) },
    { command: 'sprite.select_invert', label: MANAGER_TEXT.invert },
    { command: 'sprite.select_unplaced', label: MANAGER_TEXT.selectUnplaced, ...unless(manager.sheet !== null, SPRITE_MENU.noSheet) },
    identicalEntries(manager),
    { label: SELECTION_TEXT.group, items: savedEntries() },
    ...traitEntries(manager),
  ],
});

export { selectEntries };
