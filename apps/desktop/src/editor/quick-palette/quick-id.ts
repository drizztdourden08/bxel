/* @layer renderer-app @kind logic */
import { QUICK_KINDS } from './quick-palette.constants';
import type { QuickChoice } from './quick-palette.type';

const parseQuickId = (value: string): QuickChoice | null => {
  const at = value.indexOf(':');
  const kind = QUICK_KINDS.find((each) => each === value.slice(0, at));
  return at < 0 || kind === undefined ? null : { kind, id: value.slice(at + 1) };
};

export { parseQuickId };
