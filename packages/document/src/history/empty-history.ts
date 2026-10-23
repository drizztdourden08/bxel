/* @layer core @kind logic */
import type { HistoryState } from './history.type';

const emptyHistory = (): HistoryState => ({ entries: [], cursor: 0, savedCursor: 0 });

export { emptyHistory };
