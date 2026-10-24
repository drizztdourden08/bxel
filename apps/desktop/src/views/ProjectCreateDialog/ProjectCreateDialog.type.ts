/* @layer renderer-app @kind types */
type ProjectCreateModel = {
  readonly name: string;
  readonly folder: string | null;
  readonly error: string | null;
  readonly valid: boolean;
  readonly setName: (name: string) => void;
  readonly choose: () => void;
  readonly create: () => void;
  readonly hide: () => void;
};

export type { ProjectCreateModel };
