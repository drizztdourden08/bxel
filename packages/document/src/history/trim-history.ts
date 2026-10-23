/* @layer core @kind logic */
import type { HistoryLimits, HistoryState } from './history.type';

const trimHistory = (history: HistoryState, limits: HistoryLimits): HistoryState => {
  const total = history.entries.length;
  let dropped = 0;
  let bytes = history.entries.reduce((sum, entry) => sum + entry.bytes, 0);
  while (total - dropped > 1 && (total - dropped > limits.maxEntries || bytes > limits.maxBytes)) {
    bytes -= history.entries[dropped]?.bytes ?? 0;
    dropped += 1;
  }
  if (dropped === 0) return history;
  const saved = history.savedCursor === null ? -1 : history.savedCursor - dropped;
  return {
    entries: history.entries.slice(dropped),
    cursor: history.cursor - dropped,
    savedCursor: saved >= 0 ? saved : null,
  };
};

export { trimHistory };
