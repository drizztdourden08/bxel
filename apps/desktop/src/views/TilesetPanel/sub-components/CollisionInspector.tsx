/* @layer renderer-app @kind component */
import { tileShapes } from '@bxel/document';
import { Stack, Text } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { CollisionBulk } from './CollisionBulk';
import { CollisionTools } from './CollisionTools';
import { ShapeActions } from './ShapeActions';
import { ShapeCanvas } from './ShapeCanvas';
import { ShapeFields } from './ShapeFields';
import { ShapeRow } from './ShapeRow';

const CollisionInspector = ({ model }: TilesetModelProps) => {
  const index = useTilesetViewStore((state) => state.shapeIndex);
  const cell = model.selected.length === 1 ? model.byKey.get(model.selected[0] ?? 0) : undefined;
  const tools = <CollisionTools model={model} />;
  if (model.selected.length > 1) {
    return (
      <Stack gap="sm" role="group" aria-label={TILESET_TEXT.collisionTitle}>
        {tools}
        <CollisionBulk model={model} />
      </Stack>
    );
  }
  if (!cell) {
    return (
      <Stack gap="sm" role="group" aria-label={TILESET_TEXT.collisionTitle}>
        {tools}
        <Text variant="caption" tone="muted">
          {TILESET_TEXT.noShapesAny}
        </Text>
      </Stack>
    );
  }
  const { tile, sprite } = cell;
  const shapes = tileShapes(tile);
  const layers = model.tileset.collisionLayers ?? ['solid'];
  const props = { model, tile, sprite };
  return (
    <Stack gap="sm" role="group" aria-label={TILESET_TEXT.collisionTitle}>
      {tools}
      <ShapeCanvas {...props} />
      <ShapeActions {...props} />
      {shapes.length === 0 ? (
        <Text variant="caption" tone="muted">
          {TILESET_TEXT.noShapes}
        </Text>
      ) : (
        <Stack gap="2xs">
          {shapes.map((shape, at) => (
            <ShapeRow key={`${shape.layer}-${shape.kind}-${at}`} tile={tile} shape={shape} index={at} selected={at === Math.min(index, shapes.length - 1)} layers={layers} />
          ))}
        </Stack>
      )}
      <ShapeFields {...props} />
    </Stack>
  );
};

export { CollisionInspector };
