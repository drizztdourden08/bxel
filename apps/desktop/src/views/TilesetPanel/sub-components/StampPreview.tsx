/* @layer renderer-app @kind component */
import { useEffect, useRef } from 'react';
import { Canvas } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { drawStamp } from '../behavior/draw-stamp';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const StampPreview = ({ model }: TilesetModelProps) => {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const flags = useTilemapStore((state) => state.flags);
  const { artwork, tileset, stamp } = model;
  useEffect(() => {
    if (canvas.current) drawStamp(canvas.current, artwork, tileset, { stamp, flags });
  }, [artwork, tileset, stamp, flags]);
  return <Canvas ref={canvas} className="tileset-panel__stamp" role="img" aria-label={TILESET_TEXT.stampPreview} />;
};

export { StampPreview };
