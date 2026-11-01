/* @layer renderer-app @kind types */
type GridContext = Pick<CanvasRenderingContext2D, 'beginPath' | 'save' | 'restore' | 'stroke' | 'moveTo' | 'lineTo' | 'rect' | 'clip' | 'globalAlpha' | 'lineWidth' | 'strokeStyle'> & {
  canvas: Pick<HTMLCanvasElement, 'width' | 'height'>;
};

export type { GridContext };
