/* @layer renderer-app @kind logic */
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { ENTRY_TILE_TEXT } from '../EntryTile.constants';
import { badgeMarks } from './badge-marks';
import { entryName } from './entry-name';

const placeOf = (fact: EntryFacts): string[] => (fact.onSheet && fact.at !== null ? [ENTRY_TILE_TEXT.at(fact.at.x, fact.at.y)] : []);

const entryLabel = (fact: EntryFacts, twin: boolean): string => [entryName(fact), ...badgeMarks(fact, twin).map((mark) => mark.text), ...placeOf(fact)].join(', ');

export { entryLabel };
