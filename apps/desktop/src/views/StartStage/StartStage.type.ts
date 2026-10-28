/* @layer renderer-app @kind types */
import type { ButtonProps, IconName } from '@drizztdourden08/tessera';

interface StartAction {
  id: string;
  label: string;
  icon: IconName;
  command: string;
  variant: NonNullable<ButtonProps['variant']>;
}

export type { StartAction };
