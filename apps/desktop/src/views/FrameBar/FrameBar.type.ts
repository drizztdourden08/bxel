/* @layer renderer-app @kind types */
interface FrameBarModel {
  readonly path: readonly string[];
  readonly notes: readonly string[];
  readonly canOpen: boolean;
  readonly canCopy: boolean;
  readonly readOnly: boolean;
  readonly open: () => void;
  readonly copy: () => void;
}

export type { FrameBarModel };
