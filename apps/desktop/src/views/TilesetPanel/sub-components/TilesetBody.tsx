/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { SplitPane, Stack, Text } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { SPLIT_RATIO, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { pickedLine } from '../behavior/picked-line';
import { BrushStrip } from './BrushStrip';
import { GridArea } from './GridArea';
import { Inspector } from './Inspector';

const TilesetBody = ({ model }: TilesetModelProps) => (
  <Stack gap="xs" className="tileset-panel" {...commandZone(COMMAND_ZONE.tileset)}>
    <BrushStrip model={model} />
    <SplitPane
      className="tileset-panel__split"
      orientation="vertical"
      collapsible
      defaultCollapsed={model.hasMap ? 'end' : 'none'}
      defaultRatio={SPLIT_RATIO.start}
      minRatio={SPLIT_RATIO.min}
      maxRatio={SPLIT_RATIO.max}
      startLabel={TILESET_TEXT.gridPane}
      endLabel={TILESET_TEXT.inspector}
      summary={<Text variant="caption" tone="muted">{pickedLine(model)}</Text>}
      start={<GridArea model={model} />}
      end={<Inspector model={model} />}
    />
  </Stack>
);

export { TilesetBody };
