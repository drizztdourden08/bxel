/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { samplePixel } from '../editor/sample-pixel';
import { slotName } from '../editor/slot-name';
import { useReadoutStore } from '../stores/useReadoutStore';
import { DESCRIBE_TEXT, ROW_RUN_MAX } from './canvas-describe.constants';

const rowRuns = (names: readonly string[]): string => {
  const runs: string[] = [];
  let from = 0;
  names.forEach((name, at) => {
    if (names[at + 1] === name) return;
    runs.push(`${name} ${at - from + 1}`);
    from = at + 1;
  });
  return runs.slice(0, ROW_RUN_MAX).join(', ');
};

const rowText = (): string => {
  const target = currentTarget();
  const { pointer } = useReadoutStore.getState();
  if (!target || pointer === null) return DESCRIBE_TEXT.noRow;
  const names = Array.from({ length: target.sprite.width }, (_, x) => slotName(target, samplePixel(target, { x, y: pointer.y })));
  return DESCRIBE_TEXT.row(pointer.y, rowRuns(names));
};

export { rowText };
