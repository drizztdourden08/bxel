/* @layer renderer-app @kind component */
import { Button, Flex, Icon, SegmentedControl, Tag, Toggle } from '@drizztdourden08/tessera';
import { backToSheet } from '../../sheet/back-to-sheet';
import { SHEET_TEXT } from '../../sheet/sheet.constants';
import { switchMode } from '../../sheet/switch-mode';
import { toggleBroadcast } from '../../sheet/toggle-broadcast';
import { useModeBar } from './behavior/useModeBar';

const ModeBar = () => {
  const bar = useModeBar();
  if (!bar) return null;
  return (
    <Flex gap="sm" align="center" role="group" aria-label={SHEET_TEXT.mode}>
      <SegmentedControl size="sm" aria-label={SHEET_TEXT.mode} value={bar.mode} options={bar.options} onChange={switchMode} />
      {bar.isolated && (
        <Button size="sm" variant="tertiary" icon={<Icon name="arrow-left" size={14} />} onClick={backToSheet}>
          {SHEET_TEXT.back}
        </Button>
      )}
      {bar.canBroadcast && (
        <Toggle size="sm" checked={bar.broadcast} label={SHEET_TEXT.paintAllHint} onChange={toggleBroadcast} />
      )}
      {bar.canBroadcast && bar.broadcast && <Tag variant="urgency" color="warning">{SHEET_TEXT.painting(bar.count)}</Tag>}
    </Flex>
  );
};

export { ModeBar };
