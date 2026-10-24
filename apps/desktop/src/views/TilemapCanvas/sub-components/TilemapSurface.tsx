/* @layer renderer-app @kind component */
import { useMemo, useRef } from 'react';
import { Box } from '@drizztdourden08/tessera';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import { MAP_TOOL_OF, TILEMAP_TEXT } from '../../../tilemap/tilemap.constants';
import { useEscapeCancel } from '../../EditorCanvas/behavior/useEscapeCancel';
import { useSyncPending } from '../../EditorCanvas/behavior/useSyncPending';
import { useViewportBridge } from '../../EditorCanvas/behavior/useViewportBridge';
import { PixelViewport } from '../../PixelViewport';
import type { PixelViewportHandle } from '../../PixelViewport';
import { MAP_CANVAS_CLASS } from '../TilemapCanvas.constants';
import type { MapLive, TilemapSurfaceProps } from '../TilemapCanvas.type';
import { mapKeyDown } from '../behavior/map-key-down';
import { useMapGestures } from '../behavior/useMapGestures';
import { useMapPaint } from '../behavior/useMapPaint';
import { useSelectionReset } from '../behavior/useSelectionReset';
import { viewportClass } from '../behavior/viewport-class';

const TilemapSurface = ({ view }: TilemapSurfaceProps) => {
  const viewport = useRef<PixelViewportHandle>(null);
  const live = useRef<MapLive>({ hover: null, drag: null });
  const tool = useToolStore((state) => state.tool);
  const stamp = useTilemapStore((state) => state.stamp);
  const flags = useTilemapStore((state) => state.flags);
  const filled = useTilemapStore((state) => state.filled);
  const selection = useTilemapStore((state) => state.selection);
  const collision = useTilemapStore((state) => state.showCollision);
  const grid = useViewStore((state) => state.grid);
  const gridTile = useViewStore((state) => state.gridTile);
  const look = useCanvasLook();
  const { target, image } = view;
  const base = useMemo(
    () => ({ target, tool: MAP_TOOL_OF[tool], stamp, flags, selection, filled, collision, cells: grid || gridTile, look }),
    [target, tool, stamp, flags, selection, filled, collision, grid, gridTile, look],
  );
  const draw = useMapPaint(base, live, viewport);
  const gesture = useMapGestures(viewport, target, live);
  useViewportBridge(viewport, true);
  useSyncPending(useEditorTarget());
  useEscapeCancel();
  useSelectionReset();
  return (
    <Box className={MAP_CANVAS_CLASS.surface} onContextMenu={(event) => event.preventDefault()}>
      <PixelViewport
        ref={viewport}
        className={viewportClass(tool)}
        label={TILEMAP_TEXT.canvasLabel}
        width={image.width}
        height={image.height}
        source={image}
        draw={draw}
        look={look}
        grid={false}
        hand={tool === 'hand'}
        onPointerPixel={gesture.hover}
        onPointerDown={gesture.down}
        onPointerMove={gesture.move}
        onPointerUp={gesture.up}
        onKeyDown={mapKeyDown(gesture)}
      />
    </Box>
  );
};

export { TilemapSurface };
