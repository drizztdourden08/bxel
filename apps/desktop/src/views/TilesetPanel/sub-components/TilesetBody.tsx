/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Box, SplitPane, Stack, Text } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { pickedLine } from '../behavior/picked-line';
import { useDockShape } from '../behavior/useDockShape';
import { SPLIT_RATIO, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { BrushStrip } from './BrushStrip';
import { GridArea } from './GridArea';
import { Inspector } from './Inspector';

const TilesetBody = ({ model }: TilesetModelProps) => {
  const { ref, wide } = useDockShape();
  const collapsed = model.hasMap ? 'end' : 'none';
  return (
    <Box ref={ref} className="tileset-panel" {...commandZone(COMMAND_ZONE.tileset)}>
      {wide ? null : <BrushStrip model={model} />}
      <SplitPane
        key={wide ? 'wide' : 'tall'}
        className="tileset-panel__split"
        orientation={wide ? 'horizontal' : 'vertical'}
        collapsible
        defaultCollapsed={collapsed}
        defaultRatio={wide ? SPLIT_RATIO.wide : SPLIT_RATIO.start}
        minRatio={SPLIT_RATIO.min}
        maxRatio={SPLIT_RATIO.max}
        startLabel={TILESET_TEXT.gridPane}
        endLabel={TILESET_TEXT.inspector}
        header={<Text variant="label">{TILESET_TEXT.inspectorHeader}</Text>}
        summary={
          <Text variant="caption" tone="muted">
            {pickedLine(model)}
          </Text>
        }
        start={<GridArea model={model} />}
        end={
          wide ? (
            <Stack gap="xs" className="tileset-panel__side">
              <BrushStrip model={model} />
              <Inspector model={model} />
            </Stack>
          ) : (
            <Inspector model={model} />
          )
        }
      />
    </Box>
  );
};

export { TilesetBody };
