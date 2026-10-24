/* @layer renderer-app @kind component */
import { Box, Pressable, Text } from '@drizztdourden08/tessera';
import { RESIZE_ANCHORS } from '../../../../../sheet-manager/manager.constants';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import type { AnchorPickerProps } from '../ManagerDialogs.type';

const AnchorPicker = ({ value, onChange }: AnchorPickerProps) => (
  <Box role="radiogroup" aria-label={DIALOG_TEXT.anchor} className="sprites-panel__anchors">
    {RESIZE_ANCHORS.map((anchor) => (
      <Pressable
        key={anchor}
        type="button"
        role="radio"
        aria-checked={anchor === value}
        aria-label={DIALOG_TEXT.anchors[anchor]}
        className="sprites-panel__anchor"
        onClick={() => onChange(anchor)}
      >
        <Text as="span" variant="caption">
          {anchor === value ? 'x' : '.'}
        </Text>
      </Pressable>
    ))}
  </Box>
);

export { AnchorPicker };
