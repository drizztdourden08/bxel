/* @layer renderer-app @kind types */
interface FileOpArgs {
  path: string;
  name: string;
  to: string;
  paths: readonly string[];
}

export type { FileOpArgs };
