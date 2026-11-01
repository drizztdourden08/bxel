/* @layer renderer-app @kind types */
import type { Relocation } from '../file-ops/file-ops.type';

type JournalEntry = { readonly id: number; readonly label: string; readonly moves: readonly Relocation[] };

interface MoveJournalState {
  readonly entries: readonly JournalEntry[];
  readonly record: (label: string, moves: readonly Relocation[]) => number;
  readonly take: (id: number) => JournalEntry | null;
  readonly takeLast: () => JournalEntry | null;
  readonly clear: () => void;
}

export type { JournalEntry, MoveJournalState };
