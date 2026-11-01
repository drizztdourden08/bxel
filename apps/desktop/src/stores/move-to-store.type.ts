/* @layer renderer-app @kind types */
type MoveTarget = { readonly path: string; readonly label: string };

type MoveRequest = { readonly paths: readonly string[]; readonly targets: readonly MoveTarget[] };

interface MoveToState {
  readonly request: MoveRequest | null;
  readonly show: (request: MoveRequest) => void;
  readonly hide: () => void;
}

export type { MoveRequest, MoveTarget, MoveToState };
