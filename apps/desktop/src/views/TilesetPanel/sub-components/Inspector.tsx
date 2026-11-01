/* @layer renderer-app @kind component */
import { ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { AnimationSection } from './AnimationSection';
import { CollisionInspector } from './CollisionInspector';
import { DataInspector } from './DataInspector';
import { EditContext } from './EditContext';
import { TerrainSection } from './TerrainSection';
import { TileProperties } from './TileProperties';

const Inspector = ({ model }: TilesetModelProps) => {
  const mode = useTilesetViewStore((state) => state.mode);
  const body = {
    tiles: model.selected.length > 0 ? (
      <TileProperties model={model} />
    ) : (
      <Text variant="caption" tone="muted">
        {TILESET_TEXT.noPick}
      </Text>
    ),
    terrain: <TerrainSection model={model} />,
    collision: <CollisionInspector model={model} />,
    data: <DataInspector model={model} />,
    animation: <AnimationSection model={model} />,
  }[mode];
  return (
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="tileset-panel__inspector" aria-label={TILESET_TEXT.inspector}>
      <Stack gap="sm" className="tileset-panel__inspector-body">
        {body}
        {mode === 'tiles' && <EditContext model={model} />}
      </Stack>
    </ScrollArea>
  );
};

export { Inspector };
