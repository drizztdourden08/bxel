/* @layer renderer-app @kind component */
import { Button } from '@drizztdourden08/tessera';
import { startLimit } from '../../../palette-change/start-limit';
import { PALETTE_PANEL_TEXT } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';

const LimitBadge = ({ panel }: PanelProps) => {
  const { bank, documentId } = panel.target;
  const used = bank.slots.length;
  const full = used >= bank.cap;
  return (
    <Button
      size="xs"
      variant="tertiary"
      className={full ? 'palette-panel__limit palette-panel__limit--full' : 'palette-panel__limit'}
      aria-label={PALETTE_PANEL_TEXT.limitName(used, bank.cap)}
      onClick={() => startLimit(documentId, bank)}
    >
      {PALETTE_PANEL_TEXT.limit(used, bank.cap)}
    </Button>
  );
};

export { LimitBadge };
