/* @layer renderer-app @kind logic */
import { planMovesIn } from '../../file-ops/plan-moves-in';
import { relocateWith } from '../../file-ops/relocate-with';
import type { OpenProject } from '../../project/project.type';
import type { ToolContext } from '../assistant.type';
import { locateInProject } from './locate-in-project';
import { toolKit } from './tool-kit';

const moveCreated = async (context: ToolContext, visible: OpenProject, paths: readonly string[], folder: string | null) => {
  const plan = folder === null ? [] : await planMovesIn(context.documents, paths, folder);
  const moves = typeof plan === 'string' ? [] : plan;
  if (moves.length > 0) await relocateWith(toolKit(context), moves);
  return paths.flatMap((path) => locateInProject(visible, moves.find((move) => move.from === path)?.to ?? path) ?? []);
};

export { moveCreated };
