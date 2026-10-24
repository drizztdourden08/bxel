/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { HintSpec } from '../ActionHint';

interface HintedOption<T extends string> {
  value: T;
  label: ReactNode;
  hint: HintSpec;
  disabled?: boolean | string;
}

interface HintedSegmentsProps<T extends string> {
  label: string;
  value: T;
  options: readonly HintedOption<T>[];
  onChange: (value: T) => void;
}

export type { HintedOption, HintedSegmentsProps };
