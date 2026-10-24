/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { useLimitControl } from '../behavior/useLimitControl';
import { ASSET_CONTROL_TEXT } from '../AssetControl.constants';

const LimitControl = () => {
  const model = useLimitControl();
  if (model === null) return null;
  return (
    <Flex gap="sm" align="center" wrap>
      <Text>{model.count}</Text>
      <Button size="sm" variant="secondary" onClick={model.change}>
        {ASSET_CONTROL_TEXT.change}
      </Button>
    </Flex>
  );
};

export { LimitControl };
