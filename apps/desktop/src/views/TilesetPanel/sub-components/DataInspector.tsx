/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { AddFieldForm } from './AddFieldForm';
import { DataFieldRow } from './DataFieldRow';

const DataInspector = ({ model }: TilesetModelProps) => {
  const fields = model.tileset.fields ?? [];
  return (
    <Stack gap="sm" role="group" aria-label={TILESET_TEXT.dataTitle}>
      {fields.length === 0 ? (
        <Text variant="caption" tone="muted">
          {TILESET_TEXT.noFields}
        </Text>
      ) : (
        <>
          <Text variant="caption" tone="muted">
            {model.selected.length === 0 ? TILESET_TEXT.dataNoPick : TILESET_TEXT.dataPaintHint}
          </Text>
          {fields.map((field) => (
            <DataFieldRow key={field.name} model={model} field={field} />
          ))}
        </>
      )}
      <AddFieldForm model={model} />
    </Stack>
  );
};

export { DataInspector };
