/* @layer renderer-app @kind types */
type PreviewScale = 1 | 2 | 4;

interface PreviewSettings {
  shown: boolean;
  scale: PreviewScale;
  onCanvas: boolean;
}

interface PreviewState extends PreviewSettings {
  toggle: () => void;
  setScale: (scale: PreviewScale) => void;
  setOnCanvas: (onCanvas: boolean) => void;
}

export type { PreviewScale, PreviewSettings, PreviewState };
