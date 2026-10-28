/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { detachPalette } from '../../../palette-panel/detach-palette';
import { reportOutcome } from '../behavior/report-outcome';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const SharedNotice = ({ panel }: PanelProps) => {
  const [open, setOpen] = useState(false);
  const { sprites } = panel.sharing;
  return (
    <Callout tone="info" variant="footnote" className="palette-panel__shared">
      <Stack gap="2xs">
        <Text variant="caption">{PALETTE_PANEL_TEXT.shared(sprites.length)}</Text>
        <Flex gap="xs" wrap>
          <Button size="xs" variant="secondary" disabled={panel.lock.locked} onClick={() => reportOutcome(detachPalette(panel.target), true)}>
            {PALETTE_PANEL_TEXT.detach}
          </Button>
          <Button size="xs" variant="tertiary" aria-expanded={open} onClick={() => setOpen(!open)}>
            {PALETTE_PANEL_TEXT.showSprites}
          </Button>
        </Flex>
        {open && (
          <Text variant="caption" tone="muted">
            {sprites.map((sprite) => sprite.name).join(', ')}
          </Text>
        )}
      </Stack>
    </Callout>
  );
};

export { SharedNotice };
