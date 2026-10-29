/* @layer renderer-app @kind component */
import { useState } from 'react';
import type { TileFieldKind } from '@bxel/document';
import { Button, Field, Flex, Select, Stack, TextInput } from '@drizztdourden08/tessera';
import { setFields } from '../../../tilemap/set-fields';
import { FIELD_KINDS, TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';
import { newField } from '../behavior/new-field';

const AddFieldForm = ({ model }: TilesetModelProps) => {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<TileFieldKind>('text');
  const [choices, setChoices] = useState('');
  const field = newField(name, kind, choices);
  const taken = (model.tileset.fields ?? []).some((each) => each.name === name.trim());
  const add = (): void => {
    if (!field || taken) return;
    if (setFields({ fields: [...(model.tileset.fields ?? []), field] })) {
      setName('');
      setChoices('');
    }
  };
  return (
    <Stack gap="xs" role="group" aria-label={TILESET_TEXT.addField}>
      <Flex gap="xs" align="end" wrap>
        <Field label={TILESET_TEXT.fieldName}>
          <TextInput size="sm" aria-label={TILESET_TEXT.fieldName} value={name} placeholder={TILESET_TEXT.fieldHint} onChange={(event) => setName(event.target.value)} onEnter={add} />
        </Field>
        <Field label={TILESET_TEXT.fieldKind}>
          <Select size="sm" aria-label={TILESET_TEXT.fieldKind} options={[...FIELD_KINDS]} value={kind} onChange={(value) => setKind(value as TileFieldKind)} />
        </Field>
      </Flex>
      {kind === 'choice' ? (
        <Field label={TILESET_TEXT.choices} hint={TILESET_TEXT.choicesHint}>
          <TextInput size="sm" aria-label={TILESET_TEXT.choices} value={choices} placeholder="stone, water, lava" onChange={(event) => setChoices(event.target.value)} onEnter={add} />
        </Field>
      ) : null}
      <Button size="sm" variant="secondary" disabled={!field || taken} onClick={add}>
        {TILESET_TEXT.addField}
      </Button>
    </Stack>
  );
};

export { AddFieldForm };
