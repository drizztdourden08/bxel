/* @layer renderer-app @kind types */
interface ThumbSize {
  width: number;
  height: number;
  scale: number;
}

interface ThumbBox {
  width: number;
  height: number;
}

interface ImageRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type { ImageRect, ThumbBox, ThumbSize };
