/* @layer renderer-app @kind types */
import type { CellMapper, Session } from './e2e.type';

type SheetRig = {
  readonly session: Session;
  readonly root: string;
  readonly saveAll: () => Promise<void>;
  readonly parts: () => Uint8Array[];
  readonly mapper: () => Promise<CellMapper>;
};

export type { SheetRig };
