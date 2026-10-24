/* @layer renderer-app @kind logic */
import type { CanvasLook } from './canvas-look.type';

const surroundKey = (look: CanvasLook, dpr: number): string =>
  `${look.surroundA}|${look.surroundB}|${look.surroundScale}|${look.surroundBits}|${dpr}`;

export { surroundKey };
