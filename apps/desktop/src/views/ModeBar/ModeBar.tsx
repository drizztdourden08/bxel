/* @layer renderer-app @kind component */
import { Button, Flex, Icon, Tag, Toggle } from '@drizztdourden08/tessera';
import { backToSheet } from '../../sheet/back-to-sheet';
import { SHEET_TEXT } from '../../sheet/sheet.constants';
import { switchMode } from '../../sheet/switch-mode';
import { toggleBroadcast } from '../../sheet/toggle-broadcast';
import { ActionHint } from '../ActionHint';
import { HintedSegments } from '../HintedSegments';
import { BACK_HINT, PAINT_ALL_HINT } from './ModeBar.constants';
import { useModeBar } from './behavior/useModeBar';

const ModeBar = () => {
  const bar = useModeBar();
  if (!bar) return null;
  return (
    <Flex gap="sm" align="center" role="group" aria-label={SHEET_TEXT.mode}>
      <HintedSegments label={SHEET_TEXT.mode} value={bar.mode} options={bar.options} onChange={switchMode} />
      {bar.isolated && (
        <ActionHint hint={BACK_HINT}>
          <Button size="sm" variant="tertiary" icon={<Icon name="arrow-left" size={14} />} onClick={backToSheet}>
            {SHEET_TEXT.back}
          </Button>
        </ActionHint>
      )}
      {bar.canBroadcast && (
        <ActionHint hint={PAINT_ALL_HINT}>
          <Toggle size="sm" checked={bar.broadcast} label={SHEET_TEXT.paintAll} onChange={toggleBroadcast} />
        </ActionHint>
      )}
      {bar.canBroadcast && bar.broadcast && <Tag variant="urgency" color="warning">{SHEET_TEXT.painting(bar.count)}</Tag>}
    </Flex>
  );
};

export { ModeBar };
