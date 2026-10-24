/* @layer renderer-app @kind constants */
import type { CalloutProps } from '@drizztdourden08/tessera';
import type { RuleTier } from '@bxel/presets';

const FINDING_TONES: Readonly<Record<RuleTier, NonNullable<CalloutProps['tone']>>> = {
  enforce: 'danger',
  warn: 'warning',
  advisory: 'info',
};

export { FINDING_TONES };
