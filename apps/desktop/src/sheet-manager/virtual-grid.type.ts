/* @layer renderer-app @kind types */
type WindowPart = { kind: 'space'; at: number; rows: number } | { kind: 'row'; at: number; rows: 1 };

interface SpacerBlock {
  at: number;
  size: number;
}

interface GridMetrics {
  rowHeight: number;
  left: number;
  inset: number;
  tileWidth: number;
  tileHeight: number;
  gap: number;
}

export type { GridMetrics, SpacerBlock, WindowPart };
