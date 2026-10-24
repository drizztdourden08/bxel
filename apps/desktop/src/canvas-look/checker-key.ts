/* @layer renderer-app @kind logic */
import type { CanvasLook } from './canvas-look.type';

const checkerKey = (look: CanvasLook, dpr: number): string => `${look.checkerA}|${look.checkerB}|${look.checkerSize}|${dpr}`;

export { checkerKey };
