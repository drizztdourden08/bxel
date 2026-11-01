/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import type { PaletteTarget } from '../editor/editor.type';
import { createProjectPalette } from '../project-config/create-project-palette';
import { focusedProject } from '../project-config/focused-project';
import { paletteFileOf } from './palette-file-of';
import { PALETTE_EXPORT_TEXT } from './palette-export.constants';

const saveProjectPalette = async (target: PaletteTarget, indices: readonly number[] | null): Promise<void> => {
  if (!focusedProject()) {
    toast(PALETTE_EXPORT_TEXT.noProject, { variant: 'info' });
    return;
  }
  const { bank } = target;
  const colors = paletteFileOf(bank, indices).colors.map((color) => color.hex);
  const problem = await createProjectPalette({ name: bank.name, cap: bank.cap, transparent: bank.transparent, colors });
  toast(problem ?? PALETTE_EXPORT_TEXT.savedProject(bank.name), { variant: problem === null ? 'success' : 'danger' });
};

export { saveProjectPalette };
