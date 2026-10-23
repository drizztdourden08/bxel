/* @layer core @kind logic */
import type { CelId } from '../model/ids.type';
import type { PaletteBank } from '../model/palette.type';
import { emptyCel } from '../pixels/empty-cel';
import { absentIssue } from './absent-issue';
import { damageOf } from './damage-of';
import type { SpriteJson } from './document-json.type';
import { entryPaths } from './entry-paths';
import type { EntryCheck } from './entry-check.type';
import type { LoadIssue } from './load-report.type';
import { pixelProblem } from './pixel-problem';
import type { RestoredCel } from './restored-cel.type';

const damaged = (sprite: SpriteJson, celId: CelId, issue: LoadIssue): RestoredCel => ({
  cel: { id: celId, pixels: emptyCel(sprite) },
  damage: damageOf(sprite, celId, issue),
});

const restoreCel = (sprite: SpriteJson, bank: PaletteBank, celId: CelId, source: EntryCheck): RestoredCel => {
  const path = entryPaths.cel(celId);
  const bytes = source.good.get(path);
  if (!bytes) return damaged(sprite, celId, absentIssue(path, source.problems));
  const problem = pixelProblem(bytes, sprite, bank, path);
  return problem ? damaged(sprite, celId, problem) : { cel: { id: celId, pixels: bytes }, damage: null };
};

export { restoreCel };
