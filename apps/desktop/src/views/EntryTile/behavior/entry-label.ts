/* @layer renderer-app @kind logic */
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { badgeMarks } from './badge-marks';
import { entryName } from './entry-name';

const entryLabel = (fact: EntryFacts, twin: boolean): string => [entryName(fact), ...badgeMarks(fact, twin).map((mark) => mark.text)].join(', ');

export { entryLabel };
