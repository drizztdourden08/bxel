/* @layer renderer-app @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera';
import { PALETTE_TEXT } from '../../../editor/palette-text.constants';
import { openSheet } from '../behavior/open-sheet';
import { selectUnused } from '../behavior/select-unused';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const PaletteFooter = ({ panel }: PanelProps) => {
  const { bank } = panel.target;
  const unused = panel.usage?.unused.length ?? 0;
  const duplicates = panel.duplicates.reduce((sum, group) => sum + group.length - 1, 0);
  return (
    <Flex align="center" gap="xs" wrap className="palette-panel__footer">
      <Text variant="caption" tone="muted">
        {PALETTE_TEXT.count(bank.cap, bank.transparent)}
      </Text>
      {unused > 0 && (
        <Button size="xs" variant="tertiary" onClick={() => selectUnused(panel)}>
          {PALETTE_PANEL_TEXT.unused(unused)}
        </Button>
      )}
      {duplicates > 0 && (
        <Button size="xs" variant="tertiary" disabled={panel.lock.locked} onClick={() => openSheet(panel, 'duplicates')}>
          {PALETTE_PANEL_TEXT.duplicates(duplicates)}
        </Button>
      )}
      {panel.lock.locked && (
        <Text variant="caption" tone="warning">
          {panel.lock.reason}
        </Text>
      )}
    </Flex>
  );
};

export { PaletteFooter };
