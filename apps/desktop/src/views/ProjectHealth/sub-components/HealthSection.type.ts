/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';

type HealthSectionProps = {
  readonly title: string;
  readonly hint: string;
  readonly count: number;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
};

export type { HealthSectionProps };
