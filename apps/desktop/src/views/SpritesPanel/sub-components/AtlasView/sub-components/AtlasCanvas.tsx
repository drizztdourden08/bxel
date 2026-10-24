/* @layer renderer-app @kind component */
import { Box, Canvas } from '@drizztdourden08/tessera';
import { useMemo } from 'react';
import { atlasHit } from '../../../../../sheet-manager/atlas-hit';
import { atlasScale } from '../../../../../sheet-manager/atlas-scale';
import { ATLAS_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { pickVisible } from '../../../../../sheet-manager/pick-visible';
import { pickHow } from '../../../../../sheet/pick-how';
import { useManagerStore } from '../../../../../stores/useManagerStore';
import { useAtlasCanvas } from '../behavior/useAtlasCanvas';
import type { AtlasCanvasProps } from '../AtlasView.type';

const AtlasCanvas = ({ model, atlas }: AtlasCanvasProps) => {
  const settings = useManagerStore((state) => state.atlas);
  const scale = atlasScale(settings.zoom, atlas.width, atlas.height);
  const selected = useMemo(() => new Set(model.scene.selected.map((sprite) => sprite.id)), [model.scene.selected]);
  const view = useMemo(
    () => ({ artwork: model.artwork, atlas, scale, bounds: settings.bounds, pivots: settings.pivots, selected }),
    [model.artwork, atlas, scale, settings.bounds, settings.pivots, selected],
  );
  const canvas = useAtlasCanvas(view);
  return (
    <Box className="sprites-panel__atlas">
      <Canvas
        ref={canvas}
        className="sprites-panel__atlas-canvas"
        role="img"
        aria-label={ATLAS_TEXT.canvas}
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          const point = { x: Math.floor((event.clientX - box.left) / scale), y: Math.floor((event.clientY - box.top) / scale) };
          const id = atlasHit(atlas.items, point);
          if (id) pickVisible(atlas.items.map((item) => item.id), id, pickHow(event) ?? 'replace');
        }}
      />
    </Box>
  );
};

export { AtlasCanvas };
