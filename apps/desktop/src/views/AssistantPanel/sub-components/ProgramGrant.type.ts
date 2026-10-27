/* @layer renderer-app @kind types */
import type { Grant, TrustEntry } from '@bxel/mcp';

type ProgramGrantProps = {
  readonly program: TrustEntry;
  readonly onGrant: (key: string, grant: Grant) => void;
};

export type { ProgramGrantProps };
