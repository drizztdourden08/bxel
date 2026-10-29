/* @layer renderer-app @kind component */
import { Button, EmptyState } from '@drizztdourden08/tessera';
import { animationFromTile } from '../../../tile-animation/animation-from-tile';
import { TIMELINE_PANEL_TEXT } from '../TimelinePanel.constants';
import type { TileStillProps } from './TileStill.type';

const TileStill = ({ artwork, tileset, tile }: TileStillProps) => (
  <EmptyState
    size="sm"
    title={TIMELINE_PANEL_TEXT.tileStill}
    message=""
    action={
      <Button variant="primary" size="sm" onClick={() => animationFromTile(artwork, tileset, tile)}>
        {TIMELINE_PANEL_TEXT.tileNew}
      </Button>
    }
  />
);

export { TileStill };
