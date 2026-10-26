/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';
import { SizeFields } from './SizeFields';

const AnimationFields = (props: CreateFieldsProps) => (
  <>
    <SizeFields {...props} />
    <Text variant="caption" tone="muted">
      {NEW_TEXT.animationNote}
    </Text>
  </>
);

export { AnimationFields };
