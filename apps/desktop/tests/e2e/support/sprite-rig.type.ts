/* @layer renderer-app @kind types */
import type { CellMapper, Session } from './e2e.type';

type SpriteRig = {
  readonly session: Session;
  readonly map: CellMapper;
  readonly shown: () => Promise<Uint8Array>;
};

export type { SpriteRig };
