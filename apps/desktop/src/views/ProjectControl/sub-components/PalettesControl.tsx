/* @layer renderer-app @kind component */
import { Button, Callout, Flex, ListItemList, ListItemRow, Icon, Select, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { usePalettes } from '../behavior/usePalettes';
import { PALETTES_TEXT } from '../ProjectControl.constants';

const PalettesControl = () => {
  const model = usePalettes();
  const [chosen, setChosen] = useState('');
  return (
    <Stack gap="md">
      <ListItemList label={PALETTES_TEXT.list}>
        {model.files.map((file) => (
          <ListItemRow
            key={file.id}
            icon={<Icon name="pixel-palette" />}
            name={file.name}
            meta={`${file.path}, ${PALETTES_TEXT.users(file.users)}`}
            actionVisibility="always"
            action={
              <Flex gap="2xs">
                <Button size="xs" variant="tertiary" onClick={() => model.open(file.id)}>
                  {PALETTES_TEXT.open}
                </Button>
                <Button size="xs" variant="tertiary" onClick={() => model.reveal(file.id)}>
                  {PALETTES_TEXT.reveal}
                </Button>
                <Button size="xs" variant="tertiary" disabled={model.busy} onClick={() => model.exportFile(file.id)}>
                  {PALETTES_TEXT.export}
                </Button>
              </Flex>
            }
          />
        ))}
      </ListItemList>
      {model.files.length === 0 && (
        <Text variant="caption" tone="muted">
          {PALETTES_TEXT.none}
        </Text>
      )}
      <Flex gap="xs" wrap align="center">
        <Button size="sm" variant="secondary" disabled={model.busy} onClick={model.create}>
          {PALETTES_TEXT.create}
        </Button>
        <Button size="sm" variant="secondary" disabled={model.busy} onClick={model.importFile}>
          {PALETTES_TEXT.importFile}
        </Button>
      </Flex>
      <Flex gap="xs" wrap align="center">
        <Select searchable groups={model.groups} value={chosen} onChange={setChosen} placeholder={PALETTES_TEXT.library} aria-label={PALETTES_TEXT.library} />
        <Button size="sm" variant="secondary" disabled={model.busy || chosen === ''} onClick={() => model.addFromLibrary(chosen)}>
          {PALETTES_TEXT.fromLibrary}
        </Button>
      </Flex>
      {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
    </Stack>
  );
};

export { PalettesControl };
