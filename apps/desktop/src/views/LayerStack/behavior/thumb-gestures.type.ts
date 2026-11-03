/* @layer renderer-app @kind types */
interface ThumbClick {
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  stopPropagation: () => void;
}

export type { ThumbClick };
