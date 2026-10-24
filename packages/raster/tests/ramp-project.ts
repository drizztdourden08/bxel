/* @layer tests @kind logic */
import type { Project, RampId, SwatchId } from '@bxel/document';
import { brand } from './brand';
import { rowsProject } from './rows-project';

const swatchOf = (slot: number): SwatchId => brand<SwatchId>(`sw_${String(slot + 3).padStart(6, '0')}`);

const withRamps = (project: Project): Project => {
  const [bank] = project.banks;
  if (!bank) throw new Error('the project needs a bank');
  const ramps = [
    { id: brand<RampId>('rmp_000090'), name: 'Violet', swatches: [1, 2, 3, 4].map(swatchOf) },
    { id: brand<RampId>('rmp_000091'), name: 'Empty', swatches: [] },
  ];
  return { ...project, banks: [{ ...bank, ramps }] };
};

const rampProject = (rows: readonly string[]): Project => withRamps(rowsProject(rows));

export { rampProject, withRamps };
