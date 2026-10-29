/* @layer electron-main @kind types */
import type { Grant } from '@bxel/mcp';

type RestartHandoff = {
  readonly key: string;
  readonly grant: Grant;
  readonly at: number;
  readonly receivedAt: number;
};

export type { RestartHandoff };
