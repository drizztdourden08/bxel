/* @layer renderer-app @kind component */
import { useState } from 'react';
import { tileShapes } from '@bxel/document';
import { Button, Field, Flex, NumberInput, TextInput } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { COLLISION_RECT_FIELDS } from '../../../tilemap/collision/collision.constants';
import { parsePoints } from '../../../tilemap/collision/parse-points';
import { pointsText } from '../../../tilemap/collision/points-text';
import { replaceShape } from '../behavior/replace-shape';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { ShapeEditorProps } from '../TilesetPanel.type';

const ShapeFields = ({ model, tile }: ShapeEditorProps) => {
  const index = useTilesetViewStore((state) => state.shapeIndex);
  const [draft, setDraft] = useState<string | null>(null);
  const shapes = tileShapes(tile);
  const selected = Math.min(index, shapes.length - 1);
  const shape = shapes[selected];
  if (shape?.kind === 'rect') {
    return (
      <Flex gap="xs" wrap>
        {COLLISION_RECT_FIELDS.map((field) => (
          <Field key={field.id} label={field.label} size="sm">
            <NumberInput
              size="sm"
              aria-label={`${TILESET_TEXT.boxField} ${field.label}`}
              min={field.id === 'width' || field.id === 'height' ? 1 : 0}
              max={field.id === 'x' || field.id === 'width' ? model.tileset.tileWidth : model.tileset.tileHeight}
              value={shape[field.id]}
              onChange={(value) => Number.isInteger(value) && replaceShape(tile, selected, { ...shape, [field.id]: value })}
            />
          </Field>
        ))}
      </Flex>
    );
  }
  if (shape?.kind !== 'polygon') return null;
  const commit = (): void => {
    const points = draft === null ? null : parsePoints(draft);
    if (points && points.length >= 3) replaceShape(tile, selected, { ...shape, points });
    setDraft(null);
  };
  return (
    <Flex gap="xs" align="end" wrap>
      <Field label={TILESET_TEXT.points} hint={TILESET_TEXT.pointsHint}>
        <TextInput
          size="sm"
          aria-label={TILESET_TEXT.points}
          value={draft ?? pointsText(shape.points)}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => event.key === 'Enter' && commit()}
        />
      </Field>
      <Button
        size="sm"
        variant="tertiary"
        disabled={shape.points.length <= 3}
        onClick={() => replaceShape(tile, selected, { ...shape, points: shape.points.slice(0, -1) })}
      >
        {TILESET_TEXT.removePoint}
      </Button>
    </Flex>
  );
};

export { ShapeFields };
