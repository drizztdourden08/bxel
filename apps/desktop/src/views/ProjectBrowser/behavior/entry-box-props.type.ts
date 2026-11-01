/* @layer renderer-app @kind types */
import type { useEntryHandlers } from './useEntryHandlers';

type EntryHandlers = ReturnType<typeof useEntryHandlers>;

export type { EntryHandlers };
