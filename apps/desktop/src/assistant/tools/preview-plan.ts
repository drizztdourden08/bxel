/* @layer renderer-app @kind logic */
import type { Artwork, Sprite } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { PlanInput, PlanOf, PlanResult, ToolReply } from '@bxel/mcp';
import { stripPlan } from '../../add-frames/strip-plan';
import { COMPOSE_TEXT } from '../../sheet-manager/compose-text.constants';
import { planFolder } from '../../sheet-manager/plan-folder';
import { planRenames } from '../../sheet-manager/plan-renames';
import { slicePlan } from '../../sheet-manager/slice-plan';
import type { RenamePlan } from '../../sheet-manager/manager.type';
import { stayingSprites } from '../../sheet-manager/staying-sprites';
import { stripHint } from '../../sheet-manager/strip-hint';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { selectionIds } from '../../sheet/selection-ids';
import { currentScene } from '../../sheet/current-scene';
import type { ToolContext } from '../assistant.type';
import { reply } from './reply';
import { renameSpec } from './rename-spec';
import { sliceSpec } from './slice-spec';
import { stripSpec } from './strip-spec';
import { otherNames } from './other-names';
import { spriteTargets } from './sprite-targets';
import { viewFor } from './view-for';



const empty = (kind: PlanResult['kind']): PlanResult => ({ kind, ok: false, names: [], rects: [], grid: null, hint: null, error: null });

const renamed = (kind: 'rename' | 'folder', plan: RenamePlan): PlanResult => ({
  ...empty(kind),
  ok: plan.ok,
  names: plan.entries.map((entry) => ({ id: entry.id, from: entry.from, to: entry.to, error: entry.error })),
  error: plan.ok ? null : (plan.entries.find((entry) => entry.error !== null)?.error ?? 'No name would change.'),
});

const sliced = (spec: ReturnType<typeof sliceSpec>, artwork: Artwork, sprites: readonly Sprite[]): PlanResult => {
  const plan = slicePlan(spec, sprites, stayingSprites(artwork, sprites, spec.keep));
  return {
    ...empty('slice'),
    ok: plan.error === null,
    names: plan.names.map((to) => ({ id: null, from: null, to, error: null })),
    rects: plan.rects.map((rect) => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height })),
    grid: plan.grid === null ? null : { columns: plan.grid.columns, rows: plan.grid.rows, cellWidth: plan.grid.cellWidth, cellHeight: plan.grid.cellHeight },
    error: plan.error,
  };
};

const stripped = (args: PlanOf<'strip'>, target: Sprite): PlanResult => {
  const spec = stripSpec(args, target, null);
  const plan = stripPlan(target, spec.strip);
  const hint = stripHint(target);
  return {
    ...empty('strip'),
    ok: plan.error === null && plan.cells.length > 0,
    rects: plan.cells.map((cell) => ({ x: cell.x, y: cell.y, width: cell.width, height: cell.height })),
    hint: hint === null ? null : { cells: hint.cells, columns: hint.columns, rows: hint.rows },
    error: plan.error,
  };
};

const planOf = (plan: PlanInput, artwork: Artwork, fallback: readonly string[]): PlanResult | string => {
  if (plan.kind === 'strip') {
    const found = spriteTargets(artwork, plan.sprite === undefined ? undefined : [plan.sprite], fallback);
    const [target] = found.ok ? found.sprites : [];
    if (!found.ok) return found.problem;
    return found.sprites.length === 1 && target !== undefined ? stripped(plan, target) : COMPOSE_TEXT.needStrip;
  }
  const found = spriteTargets(artwork, plan.sprites, fallback);
  if (!found.ok) return found.problem;
  const { sprites } = found;
  if (plan.kind === 'slice') return sliced(sliceSpec(plan), artwork, sprites);
  if (plan.kind === 'folder') return renamed('folder', planFolder(plan.folder, sprites, otherNames(artwork, sprites, false)));
  const copy = plan.copy === true;
  return renamed('rename', planRenames(renameSpec(plan, copy), sprites, otherNames(artwork, sprites, copy)));
};

const previewPlan = (context: ToolContext, documentId: string, plan: PlanInput): ToolReply => {
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const scene = documentId === useDocumentStore.getState().activeId ? currentScene() : null;
  const fallback = scene === null ? [] : selectionIds(scene);
  const result = planOf(plan, view.state.artwork, fallback);
  if (typeof result === 'string') return reply(mcpFailure(MCP_ERROR_CODE.VIEW_INVALID, result, { path: 'plan' }));
  return reply({ ok: true, mode: 'plan', plan: result });
};

export { previewPlan };
