/* @layer core @kind logic */
import { ERROR_CODE, fail, requireSprite } from '@bxel/document';
import type { CommandInput, Project } from '@bxel/document';
import { uncoveredIssues } from './uncovered-issues';

const checkTurnCoverage = (project: Project, input: CommandInput): void => {
  const details = input.sprites.flatMap((spriteId) =>
    uncoveredIssues(
      requireSprite(project, spriteId),
      input.cels.filter((cel) => cel.spriteId === spriteId),
    ),
  );
  if (details.length > 0) {
    throw fail(
      ERROR_CODE.INCOMPATIBLE_TARGETS,
      'A turn changes the size of the whole sprite, so the scope must reach every layer and frame, and none may be locked or hidden.',
      { details },
    );
  }
};

export { checkTurnCoverage };
