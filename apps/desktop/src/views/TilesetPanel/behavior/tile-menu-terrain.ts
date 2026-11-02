/* @layer renderer-app @kind logic */
import { slotMask } from '@bxel/document';
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { TERRAIN_COMMAND } from '../../../keymap/terrain-command-id.constants';
import { activeSet } from '../../../tilemap/terrain/active-set';
import { maskWords } from '../../../tilemap/terrain/mask-words';
import { TILE_MENU } from '../TilesetPanel.constants';

const terrainSlotEntry = (key: number): ContextMenuEntry => {
  const set = activeSet();
  const items: readonly ContextMenuEntry[] = set
    ? set.slots.flatMap((variants, slot) =>
        variants.length === 0
          ? [{ command: TERRAIN_COMMAND.editSlot, label: TILE_MENU.slotWord(slot, maskWords(slotMask(set.kind, slot))), args: { slot, action: 'use', key, set: set.id } }]
          : [],
      )
    : [];
  return { label: TILE_MENU.termSlot, items, disabled: items.length === 0 };
};

export { terrainSlotEntry };
