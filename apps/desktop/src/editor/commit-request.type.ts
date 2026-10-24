/* @layer renderer-app @kind types */
interface CommitStep {
  name: string;
  options: unknown;
  ref?: string;
}

export type { CommitStep };
