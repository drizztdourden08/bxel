/* @layer renderer-app @kind types */
type CanvasPreviewKind = 'background' | 'grid';

interface CanvasPreviewProps {
  kind: CanvasPreviewKind;
}

export type { CanvasPreviewKind, CanvasPreviewProps };
