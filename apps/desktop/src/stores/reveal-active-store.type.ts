/* @layer renderer-app @kind types */
interface RevealActiveState {
  pending: boolean;
  ask: () => void;
  take: () => boolean;
}

export type { RevealActiveState };
