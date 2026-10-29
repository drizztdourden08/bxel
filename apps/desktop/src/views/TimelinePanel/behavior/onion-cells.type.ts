/* @layer renderer-app @kind types */
interface OnionCell {
  key: string;
  side: 'before' | 'now' | 'after';
  step: number;
}

export type { OnionCell };
