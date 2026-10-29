/* @layer renderer-app @kind types */
interface Mixed<T> {
  mixed: boolean;
  value: T | undefined;
}

export type { Mixed };
