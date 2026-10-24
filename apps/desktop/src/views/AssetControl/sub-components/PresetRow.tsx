/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';
import type { PresetRowProps } from '../AssetControl.type';

const PresetRow = ({ row, onRename, onRemove, onRun }: PresetRowProps) => {
  const [draft, setDraft] = useState<string | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const save = (): void => {
    const failure = onRename(row.name, draft ?? row.name);
    setProblem(failure);
    if (failure === null) setDraft(null);
  };
  const stop = (): void => {
    setDraft(null);
    setProblem(null);
  };
  return (
    <Stack gap="xs">
      <Flex gap="sm" align="center" wrap>
        {draft === null ? (
          <Stack gap="2xs">
            <Text>{row.name}</Text>
            <Text variant="caption" tone="muted">
              {row.detail}
            </Text>
          </Stack>
        ) : (
          <TextInput size="sm" value={draft} aria-label={ASSET_CONTROL_TEXT.presetName} onChange={(event) => setDraft(event.target.value)} onEnter={save} />
        )}
        {draft === null ? (
          <>
            <Button size="sm" variant="secondary" onClick={() => onRun(row.name)}>
              {ASSET_CONTROL_TEXT.presetRun}
            </Button>
            <Button size="sm" variant="tertiary" onClick={() => setDraft(row.name)}>
              {ASSET_CONTROL_TEXT.presetRename}
            </Button>
            <Button size="sm" variant="tertiary" onClick={() => onRemove(row.name)}>
              {ASSET_CONTROL_TEXT.presetDelete}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="secondary" onClick={save}>
              {ASSET_CONTROL_TEXT.presetSave}
            </Button>
            <Button size="sm" variant="tertiary" onClick={stop}>
              {ASSET_CONTROL_TEXT.presetCancel}
            </Button>
          </>
        )}
      </Flex>
      {problem !== null && <Callout tone="danger">{problem}</Callout>}
    </Stack>
  );
};

export { PresetRow };
