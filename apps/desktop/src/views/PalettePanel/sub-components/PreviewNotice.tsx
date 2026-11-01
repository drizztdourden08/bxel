/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Text } from '@drizztdourden08/tessera';
import { endPreview } from '../../../palette-preview/end-preview';
import { PREVIEW_TEXT } from '../../../palette-preview/palette-preview.constants';
import { useBankPreview } from '../behavior/useBankPreview';
import type { PanelProps } from '../PalettePanel.type';

/** Shown while the canvas is drawn through another palette. */
const PreviewNotice = ({ panel }: PanelProps) => {
  const name = useBankPreview(panel);
  if (name === null) return null;
  return (
    <Callout tone="info" variant="footnote" className="palette-panel__preview">
      <Flex align="center" justify="between" gap="xs" wrap>
        <Text variant="caption">{PREVIEW_TEXT.active(name)}</Text>
        <Button size="xs" variant="secondary" onClick={endPreview}>
          {PREVIEW_TEXT.end}
        </Button>
      </Flex>
    </Callout>
  );
};

export { PreviewNotice };
