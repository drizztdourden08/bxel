/* @layer renderer-app @kind component */
import { Button, Field, Flex, Select, Stack } from '@drizztdourden08/tessera';
import { useSetLoader } from '../behavior/useSetLoader';
import { PALETTE_SETTINGS_TEXT } from '../PaletteSettings.constants';

const SetLoader = () => {
  const loader = useSetLoader();
  return (
    <Stack gap="xs">
      <Field label={PALETTE_SETTINGS_TEXT.setLabel}>
        <Select searchable groups={loader.groups} value={loader.value} onChange={loader.choose} placeholder={PALETTE_SETTINGS_TEXT.setPlaceholder} />
      </Field>
      <Flex gap="xs" wrap>
        <Button size="sm" variant="secondary" disabled={loader.empty} onClick={() => loader.load('append')}>
          {PALETTE_SETTINGS_TEXT.addColors}
        </Button>
        <Button size="sm" variant="secondary" disabled={loader.empty} onClick={() => loader.load('replace')}>
          {PALETTE_SETTINGS_TEXT.replaceColors}
        </Button>
      </Flex>
    </Stack>
  );
};

export { SetLoader };
