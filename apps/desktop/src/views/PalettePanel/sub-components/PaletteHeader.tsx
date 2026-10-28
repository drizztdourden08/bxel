/* @layer renderer-app @kind component */
import { Flex, SegmentedControl } from '@drizztdourden08/tessera';
import { PALETTE_PANEL_TEXT, VIEW_OPTIONS } from '../PalettePanel.constants';
import type { PanelProps } from '../PalettePanel.type';
import { ConfigButton } from './ConfigButton';
import { LimitBadge } from './LimitBadge';
import { PaletteOverflow } from './PaletteOverflow';
import { PaletteSwitcher } from './PaletteSwitcher';

const PaletteHeader = ({ panel }: PanelProps) => (
  <Flex align="center" gap="xs" className="palette-panel__header">
    <PaletteSwitcher panel={panel} />
    <LimitBadge panel={panel} />
    <SegmentedControl size="sm" label={PALETTE_PANEL_TEXT.views} value={panel.view.view} options={VIEW_OPTIONS} onChange={(view) => panel.view.change({ view })} />
    <PaletteOverflow panel={panel} />
    <ConfigButton />
  </Flex>
);

export { PaletteHeader };
