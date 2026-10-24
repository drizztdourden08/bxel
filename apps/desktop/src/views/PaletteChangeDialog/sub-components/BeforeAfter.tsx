/* @layer renderer-app @kind component */
import { Flex, Stack, Text } from '@drizztdourden08/tessera';
import { CHANGE_TEXT } from '../../../palette-change/palette-change.constants';
import type { ChangePicture } from '../../../palette-change/palette-change.type';
import { ImagePreview } from '../../ImagePreview';
import { useSharedView } from '../../ImagePreview/behavior/useSharedView';

const BeforeAfter = ({ picture }: { picture: ChangePicture }) => {
  const view = useSharedView();
  return (
    <Flex gap="md" align="stretch">
      <Stack gap="xs" className="change-dialog__pane">
        <Text variant="label">{`${CHANGE_TEXT.before}: ${picture.spriteName}`}</Text>
        <ImagePreview image={picture.before} label={CHANGE_TEXT.before} view={view} />
      </Stack>
      <Stack gap="xs" className="change-dialog__pane">
        <Text variant="label">{`${CHANGE_TEXT.after}: ${picture.spriteName}`}</Text>
        <ImagePreview image={picture.after} label={CHANGE_TEXT.after} view={view} />
      </Stack>
    </Flex>
  );
};

export { BeforeAfter };
