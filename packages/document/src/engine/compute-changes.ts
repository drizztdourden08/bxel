/* @layer core @kind logic */
import type { ChangeSet } from '../commands/result.type';
import type { Project } from '../model/project.type';
import { diffEntities } from './diff-entities';
import { diffSprites } from './diff-sprites';

const computeChanges = (before: Project, after: Project): ChangeSet => ({
  project:
    before.name !== after.name ||
    before.defaultBankId !== after.defaultBankId ||
    before.coverSpriteId !== after.coverSpriteId,
  banks: diffEntities(before.banks, after.banks),
  sprites: diffSprites(before, after),
  sheets: diffEntities(before.sheets, after.sheets),
  presets: diffEntities(before.presets, after.presets),
});

export { computeChanges };
