/* @layer renderer-app @kind types */
interface SelectTrait {
  kind: 'tag' | 'size' | 'bank';
  value: string;
}

export type { SelectTrait };
