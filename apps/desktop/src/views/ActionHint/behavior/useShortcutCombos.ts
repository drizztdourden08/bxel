/* @layer renderer-app @kind hook */
import type { HintCombo, HintShortcut } from '../ActionHint.type';
import { useCommandKeys } from './useCommandKeys';

const useShortcutCombos = (shortcut: HintShortcut): HintCombo[] => {
  const bound = useCommandKeys(shortcut.command).map((keys): HintCombo => ({ keys }));
  const fixed = shortcut.keys !== undefined || shortcut.mouse !== undefined ? [{ keys: shortcut.keys ?? [], mouse: shortcut.mouse }] : [];
  return [...bound, ...fixed];
};

export { useShortcutCombos };
