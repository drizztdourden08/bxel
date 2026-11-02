/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, Icon, IconButton, Stack, Text } from '@drizztdourden08/tessera';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { transformStamp } from '../../../tilemap/transform-stamp';
import { ActionHint } from '../../ActionHint';
import { BRUSH_ACTIONS, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { BrushTerrainSet } from './BrushTerrainSet';
import { StampPreview } from './StampPreview';

const stampLine = (model: TilesetModelProps['model']): string => {
  const { stamp, selected } = model;
  if (selected.length === 0) return TILESET_TEXT.noBrush;
  if (stamp.scatter) return TILESET_TEXT.scatterLine(selected.length);
  if (stamp.keys.length === 1) return TILESET_TEXT.brushTile(selected[0] ?? 0);
  return TILESET_TEXT.stampLine(stamp.columns, stamp.rows);
};

const BrushStrip = ({ model }: TilesetModelProps) => {
  const flags = useTilemapStore((state) => state.flags);
  const active = { flipX: flags.flipX, flipY: flags.flipY, turnLeft: false, turnRight: false, reset: false };
  return (
    <Flex gap="sm" align="center" className="tileset-panel__brush" role="group" aria-label={TILESET_TEXT.brush}>
      <StampPreview model={model} />
      <Stack gap="2xs" className="tileset-panel__brush-body">
        <Text variant="caption" tone="muted">
          {stampLine(model)}
        </Text>
        <ButtonGroup aria-label={TILESET_TEXT.brushActions}>
          {BRUSH_ACTIONS.map((action) => (
            <ActionHint key={action.op} hint={action.hint}>
              <IconButton label={action.hint.name} size="sm" active={active[action.op]} onClick={() => transformStamp(action.op)}>
                <Icon name={action.icon} size={16} />
              </IconButton>
            </ActionHint>
          ))}
        </ButtonGroup>
        <BrushTerrainSet model={model} />
      </Stack>
    </Flex>
  );
};

export { BrushStrip };
