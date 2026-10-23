/* @layer core @kind logic */
import type { HistoryEntry, HistoryLimits, HistoryState } from './history.type';
import { trimHistory } from './trim-history';

const recordEntry = ({
  history,
  entry,
  limits,
}: {
  history: HistoryState;
  entry: HistoryEntry;
  limits: HistoryLimits;
}): HistoryState => {
  const kept = history.entries.slice(0, history.cursor);
  const lost = history.savedCursor !== null && history.savedCursor > history.cursor;
  return trimHistory(
    { entries: [...kept, entry], cursor: kept.length + 1, savedCursor: lost ? null : history.savedCursor },
    limits,
  );
};

export { recordEntry };
