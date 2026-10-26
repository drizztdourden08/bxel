/* @layer renderer-app @kind logic */
import { CHECKBOX, TEXT_ENTRY } from '../SpritesPanel.constants';

const ownsKey = (target: EventTarget, key: string): boolean => {
  if (!(target instanceof Element)) return false;
  if (target.matches(TEXT_ENTRY)) return true;
  return key === ' ' && target.matches(CHECKBOX);
};

export { ownsKey };
