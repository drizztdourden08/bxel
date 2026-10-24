/* @layer renderer-app @kind logic */
import { baseName } from './base-name';
import { clampSettings } from './clamp-settings';
import { colourMapOf } from './colour-map-of';
import { colourProblem } from './colour-problem';
import { ANIMATION_INDEXED, EXPORT_TEXT, NO_INDEXED } from './export.constants';
import type { ExportPlan, PlanInput, PlanParts, PlannedFile } from './export.type';
import { indexedStatus } from './indexed-status';
import { planAnimation } from './plan-animation';
import { planImages } from './plan-images';
import { planNotes } from './plan-notes';
import { planSheet } from './plan-sheet';
import { resolveTargets } from './resolve-targets';
import { sizeProblem } from './size-problem';

const filesOf = (parts: PlanParts): PlannedFile[] | string => {
  const { kind } = parts.settings;
  if (kind === 'sheet') return planSheet(parts);
  return kind === 'animation' ? planAnimation(parts) : planImages(parts);
};

const filesProblem = (files: readonly PlannedFile[]): string | null => {
  if (files.length === 0) return EXPORT_TEXT.noFiles;
  const names = files.map((file) => file.name.toLowerCase());
  const clash = files.find((file, index) => names.indexOf(file.name.toLowerCase()) !== index);
  return clash ? EXPORT_TEXT.clash(clash.name) : null;
};

const planExport = (input: PlanInput): ExportPlan => {
  const settings = clampSettings(input.settings);
  const { artwork, revision } = input.frozen;
  const resolved = resolveTargets(artwork, settings, input.selectedIds);
  if (!resolved.ok) {
    return { files: [], spriteCount: 0, indexed: NO_INDEXED, notes: [], problem: resolved.message, revision };
  }
  const { targets } = resolved;
  const indexed = settings.kind === 'animation' ? ANIMATION_INDEXED : indexedStatus(targets);
  const common = { revision, spriteCount: targets.length, indexed, notes: planNotes(targets, settings) };
  const early = sizeProblem(targets, settings) ?? colourProblem(settings, indexed);
  if (early !== null) return { ...common, files: [], problem: early };
  const base = baseName(artwork, settings, targets);
  const files = filesOf({ targets, settings, base, map: colourMapOf(settings, indexed) });
  if (typeof files === 'string') return { ...common, files: [], problem: files };
  return { ...common, files, problem: filesProblem(files) };
};

export { planExport };
