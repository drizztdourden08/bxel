/* @layer renderer-app @kind logic */
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { ENTRY_TILE_TEXT } from '../EntryTile.constants';
import type { BadgeMark } from '../EntryTile.type';

const badgeMarks = (fact: EntryFacts, twin: boolean, warning?: string): readonly BadgeMark[] => [
  ...(fact.kind === 'animation' ? [{ key: 'film', icon: 'pixel-animation', title: ENTRY_TILE_TEXT.frames(fact.frames), text: `${fact.frames}` } as const] : []),
  ...(twin ? [{ key: 'twin', icon: 'copy', title: ENTRY_TILE_TEXT.twin, text: '=' } as const] : []),
  ...(fact.kind === 'sprite' && fact.slices > 0 ? [{ key: 'slices', icon: 'pixel-select-rect', title: ENTRY_TILE_TEXT.slices(fact.slices), text: `S${fact.slices}` } as const] : []),
  ...(fact.kind === 'sprite' && fact.strip !== null ? [{ key: 'strip', icon: 'pixel-grid', title: ENTRY_TILE_TEXT.strip(fact.strip), text: `x${fact.strip}` } as const] : []),
  ...(fact.sheets.length > 1 ? [{ key: 'sheets', icon: 'link', title: ENTRY_TILE_TEXT.onSheets(fact.sheets), text: `${fact.sheets.length}` } as const] : []),
  ...(warning === undefined ? [] : [{ key: 'warning', icon: 'triangle-alert', title: warning, text: ENTRY_TILE_TEXT.warning } as const]),
];

export { badgeMarks };
