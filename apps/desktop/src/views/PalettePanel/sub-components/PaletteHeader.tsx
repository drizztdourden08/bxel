/* @layer renderer-app @kind component */
import { Flex, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { PALETTE_PANEL_TEXT, VIEW_OPTIONS } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { ConfigButton } from './ConfigButton';
import { LimitBadge } from './LimitBadge';
import { PaletteOverflow } from './PaletteOverflow';
import { PaletteSwitcher } from './PaletteSwitcher';

const PaletteHeader = ({ panel }: PanelProps) => (
  <Stack gap="2xs" className="palette-panel__header">
    <Flex align="center" gap="sm" className="palette-panel__header-row">
      <PaletteSwitcher panel={panel} />
      <PaletteOverflow panel={panel} />
      <ConfigButton />
    </Flex>
    <Flex align="center" justify="between" gap="xs" className="palette-panel__header-row">
      <LimitBadge panel={panel} />
      <SegmentedControl size="sm" aria-label={PALETTE_PANEL_TEXT.views} value={panel.view.view} options={VIEW_OPTIONS} onChange={(view) => panel.view.change({ view })} />
    </Flex>
  </Stack>
);

export { PaletteHeader };
