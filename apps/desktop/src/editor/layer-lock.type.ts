/* @layer renderer-app @kind types */
type LockKind = 'none' | 'transparency' | 'pixels';

interface LayerFields {
  name?: string;
  visible?: boolean;
  locked?: boolean;
  lockTransparency?: boolean;
  colour?: string | null;
}

export type { LayerFields, LockKind };
