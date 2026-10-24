/* @layer renderer-app @kind component */
import { Button, Flex, Select, Stack } from '@drizztdourden08/tessera';
import { useSetLoader } from '../behavior/useSetLoader';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';

const SetControl = () => {
  const loader = useSetLoader();
  return (
    <Stack gap="xs">
      <Select searchable groups={loader.groups} value={loader.value} onChange={loader.choose} placeholder={ASSET_CONTROL_TEXT.setPlaceholder} aria-label={ASSET_CONTROL_TEXT.setLabel} />
      <Flex gap="xs" wrap>
        <Button size="sm" variant="secondary" disabled={loader.empty} onClick={() => loader.load('append')}>
          {ASSET_CONTROL_TEXT.addColors}
        </Button>
        <Button size="sm" variant="secondary" disabled={loader.empty} onClick={() => loader.load('replace')}>
          {ASSET_CONTROL_TEXT.replaceColors}
        </Button>
      </Flex>
    </Stack>
  );
};

export { SetControl };
