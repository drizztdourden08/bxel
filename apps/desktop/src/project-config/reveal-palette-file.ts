/* @layer renderer-app @kind logic */
import { revealRow } from '../asset-list/reveal-row';
import { focusedProject } from './focused-project';

const revealPaletteFile = (id: string): void => {
  revealRow({ path: focusedProject()?.paths.get(id) ?? '' });
};

export { revealPaletteFile };
