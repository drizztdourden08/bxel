/* @layer core @kind types */
import type { ENTRY_KINDS } from './entry-kind.constants';

type EntryKind = (typeof ENTRY_KINDS)[number];

export type { EntryKind };
