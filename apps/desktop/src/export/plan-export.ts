/* @layer renderer-app @kind logic */
import { animationSources } from './animation-sources';
import { baseName } from './base-name';
import { clampSettings } from './clamp-settings';
import { colourMapOf } from './colour-map-of';
import { colourProblem } from './colour-problem';
import { ANIMATION_INDEXED, EXPORT_TEXT, NO_INDEXED } from './export.constants';
import type { ExportPlan, ExportSettings, IndexedStatus, PlanInput, PlanParts, PlannedFile, Target, TargetsResult } from './export.type';
import type { AnimationSources } from './export-parts.type';
import { indexedStatus } from './indexed-status';
import { planAnimation } from './plan-animation';
import { planClips } from './plan-clips';
import { planImages } from './plan-images';
import { planMap } from './plan-map';
import { planNotes } from './plan-notes';
import { planSheet } from './plan-sheet';
import { resolveTargets } from './resolve-targets';
import { safeName } from './safe-name';
import { sizeProblem } from './size-problem';

const filesOf = (parts: PlanParts): PlannedFile[] | string => {
  const { kind } = parts.settings;
  if (kind === 'sheet') return planSheet(parts);
  if (kind !== 'animation') return planImages(parts);
  return parts.extra.length > 0 ? planClips(parts) : planAnimation(parts);
};

const filesProblem = (files: readonly PlannedFile[]): string | null => {
  if (files.length === 0) return EXPORT_TEXT.noFiles;
  const names = files.map((file) => file.name.toLowerCase());
  const clash = files.find((file, index) => names.indexOf(file.name.toLowerCase()) !== index);
  return clash ? EXPORT_TEXT.clash(clash.name) : null;
};

const indexedOf = (targets: readonly Target[], kind: string, held: boolean): IndexedStatus => {
  if (kind === 'animation') return ANIMATION_INDEXED;
  return held ? { state: 'unavailable', note: EXPORT_TEXT.indexedSheetAnimations } : indexedStatus(targets);
};

const baseOf = (input: PlanInput, sources: AnimationSources | null, targets: readonly Target[]): string => {
  const { artwork } = input.frozen;
  const own = sources?.only ? safeName(sources.title) : '';
  if (own === '' || safeName(input.settings.fileName) !== '') return baseName(artwork, input.settings, targets);
  return own;
};

const targetsFor = (input: PlanInput, settings: ExportSettings, sources: AnimationSources | null): TargetsResult =>
  sources?.only ? { ok: true, targets: [] } : resolveTargets(input.frozen.artwork, settings, input.selectedIds, input.current);

const planExport = (input: PlanInput): ExportPlan => {
  const settings = clampSettings(input.settings);
  if (settings.kind === 'map') return planMap({ ...input, settings });
  const { artwork, revision } = input.frozen;
  const sources = animationSources(artwork, settings);
  const failed = (problem: string): ExportPlan => ({ files: [], spriteCount: 0, indexed: NO_INDEXED, notes: [], problem, revision });
  if (typeof sources === 'string') return failed(sources);
  const resolved = targetsFor(input, settings, sources);
  if (!resolved.ok) return failed(resolved.message);
  const { targets } = resolved;
  const extra = sources?.sprites ?? [];
  const indexed = indexedOf(targets, settings.kind, extra.length > 0);
  const common = { revision, spriteCount: targets.length + extra.length, indexed, notes: planNotes(targets, settings, extra) };
  const early = sizeProblem([...targets.map((target) => target.sprite), ...extra], settings) ?? colourProblem(settings, indexed);
  if (early !== null) return { ...common, files: [], problem: early };
  const base = baseOf(input, sources, targets);
  const files = filesOf({ targets, settings, base, map: colourMapOf(settings, indexed), extra });
  if (typeof files === 'string') return { ...common, files: [], problem: files };
  return { ...common, files, problem: filesProblem(files) };
};

export { planExport };
