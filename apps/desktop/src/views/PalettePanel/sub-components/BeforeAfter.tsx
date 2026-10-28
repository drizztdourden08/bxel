/* @layer renderer-app @kind component */
import { Box, Flex, Text } from '@drizztdourden08/tessera';
import { SwatchStrip } from '../../SwatchStrip';
import { EDITOR_TEXT } from '../PalettePanel.constants';
import type { BeforeAfterProps } from '../PalettePanel.type';

const BeforeAfter = ({ before, after }: BeforeAfterProps) => (
  <Flex align="center" gap="xs" className="swatch-editor__compare">
    <Box className="swatch-editor__pair">
      <SwatchStrip size="md" colours={[before, after]} label={`${EDITOR_TEXT.before} ${before.toUpperCase()}, ${EDITOR_TEXT.after} ${after.toUpperCase()}`} />
    </Box>
    <Text variant="caption" tone="muted" className="swatch-editor__hex">
      {after.toUpperCase()}
    </Text>
  </Flex>
);

export { BeforeAfter };
