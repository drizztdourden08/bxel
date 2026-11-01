/* @layer renderer-app @kind types */
import type { KeyboardEvent } from 'react';
import type { Size } from '@bxel/raster';
import type { CanvasLook } from '../../../canvas-look/canvas-look.type';
import type { ToolId } from '../../../editor/tool.type';
import type { PixelSource } from '../../PixelViewport/PixelViewport.type';
import type { useCanvasFlags } from './useCanvasFlags';

interface ViewportPropsInput {
  tool: ToolId;
  size: Size;
  source: PixelSource | undefined;
  look: CanvasLook;
  flags: ReturnType<typeof useCanvasFlags>;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

export type { ViewportPropsInput };
