/* @layer renderer-app @kind component */
import { useState } from 'react';
import { Button, Field, Flex, SegmentedControl, Select, Stack, TextInput } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { CollisionPaint } from '../../../stores/tileset-view-store.type';
import { setFields } from '../../../tilemap/set-fields';
import { PAINT_CHOICES, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const CollisionTools = ({ model }: TilesetModelProps) => {
  const view = useTilesetViewStore();
  const [name, setName] = useState('');
  const layers = model.tileset.collisionLayers ?? ['solid'];
  const taken = layers.includes(name.trim());
  const add = (): void => {
    if (name.trim() === '' || taken) return;
    if (setFields({ collisionLayers: [...layers, name.trim()] })) {
      view.setCollisionLayer(name.trim());
      setName('');
    }
  };
  return (
    <Stack gap="xs">
      <SegmentedControl
        size="sm"
        aria-label={TILESET_TEXT.paintTool}
        value={view.collisionPaint}
        options={PAINT_CHOICES.map((choice) => ({ value: choice.value, label: choice.label }))}
        onChange={(value) => view.setCollisionPaint(value as CollisionPaint)}
      />
      <Flex gap="xs" align="end" wrap>
        <Field label={TILESET_TEXT.layer}>
          <Select
            size="sm"
            aria-label={TILESET_TEXT.layer}
            options={layers.map((layer) => ({ value: layer, label: layer }))}
            value={layers.includes(view.collisionLayer) ? view.collisionLayer : (layers[0] ?? 'solid')}
            onChange={view.setCollisionLayer}
          />
        </Field>
        <Field label={TILESET_TEXT.newLayer}>
          <TextInput size="sm" aria-label={TILESET_TEXT.newLayer} value={name} placeholder={TILESET_TEXT.newLayerHint} onChange={(event) => setName(event.target.value)} onEnter={add} />
        </Field>
        <Button size="sm" variant="tertiary" disabled={name.trim() === '' || taken} onClick={add}>
          {TILESET_TEXT.addLayer}
        </Button>
      </Flex>
    </Stack>
  );
};

export { CollisionTools };
