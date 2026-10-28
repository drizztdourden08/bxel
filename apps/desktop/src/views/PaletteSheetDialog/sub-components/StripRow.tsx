/* @layer renderer-app @kind component */
import { Flex, Text } from '@drizztdourden08/tessera';
import { SwatchStrip } from '../../SwatchStrip';
import type { StripRowProps } from '../PaletteSheetDialog.type';

const StripRow = ({ label, colours }: StripRowProps) => (
  <Flex align="center" gap="sm" className="palette-sheet__row">
    <Text variant="label" className="palette-sheet__label">
      {label}
    </Text>
    <SwatchStrip size="md" colours={colours} label={`${label}: ${colours.join(', ')}`} />
  </Flex>
);

export { StripRow };
