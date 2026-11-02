/* @layer renderer-app @kind component */
import { Flex, ScrollArea, Text } from '@drizztdourden08/tessera';
import { SwatchStrip } from '../../SwatchStrip';
import type { ColourRowProps } from '../PaletteImportDialog.type';

const ColourRow = ({ label, colours }: ColourRowProps) => (
  <Flex align="start" gap="sm" className="palette-import__row">
    <Text variant="label" className="palette-import__label">
      {label}
    </Text>
    <ScrollArea axis="y" scrollbar="slim" fade={false} className="palette-import__strip">
      <SwatchStrip size="md" colours={colours} label={`${label}: ${colours.join(', ')}`} />
    </ScrollArea>
  </Flex>
);

export { ColourRow };
