/* @layer renderer-app @kind types */
import type { RampId, SwatchId } from '@bxel/document';

interface RampChange {
  name?: string;
  swatches?: readonly SwatchId[];
  delete?: boolean;
}

interface MembershipMove {
  index: number;
  from: RampId | null;
  to: RampId | null;
  copy: boolean;
}

export type { MembershipMove, RampChange };
