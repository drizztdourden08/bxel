/* @layer renderer-app @kind component */
import type { AnimDirection } from '@bxel/document';
import { Flex, NumberInput, Select, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { ASSET_CONTROL_TEXT, TAG_DIRECTION_OPTIONS, TAG_REPEAT_LIMIT } from '../AssetControl.constants';
import type { TagRowProps } from '../AssetControl.type';

const TagRow = ({ row, readOnly, edit }: TagRowProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = (): void => {
    const name = (draft ?? row.name).trim();
    setDraft(null);
    if (name !== '' && name !== row.name) edit(row.id, { name });
  };
  return (
    <Flex gap="sm" align="center" wrap>
      <TextInput
        size="sm"
        value={draft ?? row.name}
        disabled={readOnly}
        aria-label={ASSET_CONTROL_TEXT.tagName}
        onChange={(event) => setDraft(event.target.value)}
        onEnter={commit}
        onBlur={commit}
      />
      <Select
        options={TAG_DIRECTION_OPTIONS}
        value={row.direction}
        disabled={readOnly}
        aria-label={ASSET_CONTROL_TEXT.tagDirection}
        onChange={(direction) => edit(row.id, { direction: direction as AnimDirection })}
      />
      <NumberInput
        value={row.repeat}
        min={0}
        max={TAG_REPEAT_LIMIT}
        step={1}
        disabled={readOnly}
        aria-label={ASSET_CONTROL_TEXT.tagRepeat}
        onChange={(repeat) => edit(row.id, { repeat })}
      />
    </Flex>
  );
};

export { TagRow };
