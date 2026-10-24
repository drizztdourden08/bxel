/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { PRESET_TEXT } from '../../export/preset-list.constants';
import { usePresetMove } from './behavior/usePresetMove';
import './PresetMoveBar.css';

const PresetMoveBar = () => {
  const model = usePresetMove();
  if (!model) return null;
  return (
    <Flex wrap gap="md" align="center" role="status" className="preset-move-bar">
      <Text as="span" variant="label">
        {model.question}
      </Text>
      <Flex gap="sm" className="preset-move-bar__actions">
        <Button variant="primary" onClick={model.move}>
          {PRESET_TEXT.move}
        </Button>
        <Button variant="secondary" onClick={model.keep}>
          {PRESET_TEXT.keep}
        </Button>
      </Flex>
    </Flex>
  );
};

export { PresetMoveBar };
