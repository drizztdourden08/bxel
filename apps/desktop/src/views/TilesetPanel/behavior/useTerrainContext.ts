/* @layer renderer-app @kind hook */
import { findSprite, terrainSetsOf } from '@bxel/document';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { tileCanvas } from '../../../tilemap/tile-canvas';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { TilesetModel } from '../TilesetPanel.type';
import { contextSet } from './context-set';
import { drawContext } from './draw-context';
import { terrainContext } from './terrain-context';

const useTerrainContext = (model: TilesetModel, key: number): RefObject<HTMLCanvasElement | null> => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const activeId = useTilesetViewStore((state) => state.terrainSetId);
  const { artwork, tileset } = model;
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const set = contextSet(terrainSetsOf(tileset), activeId, key);
    const sources = terrainContext(set, key).map((at) => {
      const tile = at === null ? undefined : tileset.tiles.find((each) => each.key === at);
      const sprite = tile ? findSprite(artwork, tile.spriteId) : undefined;
      return sprite ? tileCanvas(artwork, sprite) : null;
    });
    drawContext(element, sources, { width: tileset.tileWidth, height: tileset.tileHeight });
  }, [artwork, tileset, activeId, key]);
  return canvas;
};

export { useTerrainContext };
