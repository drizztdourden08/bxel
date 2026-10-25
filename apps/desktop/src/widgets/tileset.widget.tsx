/* @layer renderer-app @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { commandZone } from '@drizztdourden08/brock-react';
import { Box } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../keymap/command-zone.constants';
import { TilesetPanel } from '../views/TilesetPanel';

const meta: WidgetMeta = {
  label: 'Tileset',
  icon: 'puzzle',
  defaultOpen: true,
  defaultSide: 'right',
  defaultDockedSize: 260,
  popOut: false,
  defaultVisibility: 'context-only',
};

const TilesetWidget = () => (
  <Box {...commandZone(COMMAND_ZONE.tileset)}>
    <TilesetPanel />
  </Box>
);

export default TilesetWidget;
export { meta };
