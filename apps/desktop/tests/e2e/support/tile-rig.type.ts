/* @layer renderer-app @kind types */
import type { Session } from './e2e.type';

type SavedSheet = {
  readonly names: readonly string[];
  readonly at: Readonly<Record<string, { readonly x: number; readonly y: number }>>;
  readonly layout: string;
};

type TileRig = {
  readonly session: Session;
  readonly sheetFile: string;
  readonly saved: () => Promise<SavedSheet | null>;
};

export type { SavedSheet, TileRig };
