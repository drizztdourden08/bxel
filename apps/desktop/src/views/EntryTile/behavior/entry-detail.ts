/* @layer renderer-app @kind logic */
import type { EntryFacts, SpriteFacts } from '../../../sheet-manager/manager.type';
import { ENTRY_TILE_TEXT } from '../EntryTile.constants';
import type { EntryTileState } from '../EntryTile.type';

const spriteExtras = (fact: SpriteFacts, twin: boolean): string[] => [
  ...(fact.strip === null ? [] : [ENTRY_TILE_TEXT.strip(fact.strip)]),
  ...(fact.slices > 0 ? [ENTRY_TILE_TEXT.slices(fact.slices)] : []),
  ...(twin ? [ENTRY_TILE_TEXT.twin] : []),
];

const baseOf = (fact: EntryFacts, state: EntryTileState): string[] => {
  if (fact.kind === 'animation') return [ENTRY_TILE_TEXT.animation(fact.frames)];
  return [ENTRY_TILE_TEXT.sprite(fact.sprite.width, fact.sprite.height), ...spriteExtras(fact, state.twin)];
};

const whereOf = (fact: EntryFacts, state: EntryTileState): string[] => {
  if (state.loose) return [ENTRY_TILE_TEXT.notOnSheet];
  return fact.sheets.length > 1 ? [ENTRY_TILE_TEXT.onSheets(fact.sheets)] : [];
};

const entryDetail = (fact: EntryFacts, state: EntryTileState): string => [...baseOf(fact, state), ...whereOf(fact, state)].join(', ');

export { entryDetail };
