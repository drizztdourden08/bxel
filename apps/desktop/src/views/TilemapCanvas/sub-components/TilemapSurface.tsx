/* @layer renderer-app @kind component */
import { useMemo, useRef } from 'react';
import { contextMenuZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { useAssetLook } from '../../../asset-view/useAssetLook';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { useToolStore } from '../../../stores/useToolStore';
import { useViewStore } from '../../../stores/useViewStore';
import { MAP_TOOL_OF, TILEMAP_TEXT } from '../../../tilemap/tilemap.constants';
import { useViewportBridge } from '../../EditorCanvas/behavior/useViewportBridge';
import { PixelViewport } from '../../PixelViewport';
import { RulerFrame } from '../../RulerFrame';
import type { PixelViewportHandle } from '../../PixelViewport';
import { MAP_CANVAS_CLASS, MAP_MENU } from '../TilemapCanvas.constants';
import type { MapLive, TilemapSurfaceProps } from '../TilemapCanvas.type';
import { useMapGestures } from '../behavior/useMapGestures';
import { useMapKeys } from '../behavior/useMapKeys';
import { useMapMenu } from '../behavior/useMapMenu';
import { useMapPaint } from '../behavior/useMapPaint';
import { useMapSurfaceSetup } from '../behavior/useMapSurfaceSetup';
import { useMapTileDrop } from '../../../tile-drag/useMapTileDrop';
import { useTileAnimation } from '../behavior/useTileAnimation';
import { viewportClass } from '../behavior/viewport-class';
import { feedView } from '../../../view-feed/feed-view';

const TilemapSurface = ({ view }: TilemapSurfaceProps) => {
  const viewport = useRef<PixelViewportHandle>(null);
  const surface = useRef<HTMLDivElement>(null);
  const live = useRef<MapLive>({ hover: null, drag: null });
  const tool = useToolStore((state) => state.tool);
  const stamp = useTilemapStore((state) => state.stamp);
  const flags = useTilemapStore((state) => state.flags);
  const filled = useTilemapStore((state) => state.filled);
  const selection = useTilemapStore((state) => state.selection);
  const paste = useTilemapStore((state) => state.paste);
  const collision = useTilemapStore((state) => state.showCollision);
  const hoverKey = useTilesetViewStore((state) => state.hoverKey);
  const grid = useViewStore((state) => state.grid);
  const gridTile = useViewStore((state) => state.gridTile);
  const look = useAssetLook(useCanvasLook());
  const { target, image } = view;
  const base = useMemo(
    () => ({ target, tool: MAP_TOOL_OF[tool], stamp, flags, selection, paste, filled, collision, hoverKey, cells: grid || gridTile, look }),
    [target, tool, stamp, flags, selection, paste, filled, collision, hoverKey, grid, gridTile, look],
  );
  const draw = useMapPaint(base, live, viewport);
  useTileAnimation(view, live, viewport);
  const gesture = useMapGestures(viewport, target, live);
  const keys = useMapKeys(viewport, target, live, gesture);
  useMapMenu(viewport, target, live);
  useMapTileDrop(surface, viewport, target);
  useViewportBridge(viewport, true);
  useMapSurfaceSetup(viewport);
  return (
    <Box ref={surface} className={MAP_CANVAS_CLASS.surface} onBlur={keys.onBlur} {...contextMenuZone(MAP_MENU.zone)}>
      <RulerFrame>
        <PixelViewport
          ref={viewport}
          className={viewportClass(tool)}
          label={TILEMAP_TEXT.canvasLabel}
          hint={TILEMAP_TEXT.canvasHint}
          width={image.width}
          height={image.height}
          source={image}
          draw={draw}
          look={look}
          grid={false}
          hand={tool === 'hand'}
          onView={feedView}
          onPointerPixel={(pixel) => {
            keys.onPointerPixel();
            gesture.hover(pixel);
          }}
          onPointerDown={gesture.down}
          onPointerMove={gesture.move}
          onPointerUp={gesture.up}
          onKeyDown={keys.onKeyDown}
        />
      </RulerFrame>
    </Box>
  );
};

export { TilemapSurface };
