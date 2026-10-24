/* @layer renderer-app @kind types */
interface NudgeKey {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  preventDefault: () => void;
}

export type { NudgeKey };
