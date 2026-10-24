/* @layer renderer-app @kind logic */
import type { HintCombo, HintShortcut } from '../ActionHint.type';
import { commandKeys } from './command-keys';

const shortcutCombos = (shortcut: HintShortcut): HintCombo[] => {
  const bound = shortcut.command === undefined ? [] : commandKeys(shortcut.command).map((keys): HintCombo => ({ keys }));
  const fixed = shortcut.keys !== undefined || shortcut.mouse !== undefined ? [{ keys: shortcut.keys ?? [], mouse: shortcut.mouse }] : [];
  return [...bound, ...fixed];
};

export { shortcutCombos };
