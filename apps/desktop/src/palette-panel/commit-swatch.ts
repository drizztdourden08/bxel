/* @layer renderer-app @kind logic */
import { COMMAND_NAME, formatSwatchColor, swatchAlpha } from '@bxel/document';
import type { Rgb } from '@bxel/document';
import type { EditorTarget } from '../editor/editor.type';
import { RECOLOUR_LABEL, RECOLOUR_TEXT } from '../palette-bank/palette-bank.constants';
import type { PanelOutcome, SwatchCommit } from './palette-panel.type';
import { runPanelSteps } from './run-panel-steps';

const nextName = (current: { rgb: Rgb; alpha?: number; name: string }, wanted: string, text: string): string | undefined => {
  const typed = wanted.trim();
  if (typed !== '' && typed !== current.name) return typed;
  const automatic = current.name.toLowerCase() === formatSwatchColor(current.rgb, current.alpha).toLowerCase();
  return automatic && text !== current.name ? text : undefined;
};

const commitSwatch = (target: EditorTarget, commit: SwatchCommit): PanelOutcome => {
  const slot = target.bank.slots[commit.index];
  if (slot?.kind !== 'color') return { ok: false, message: RECOLOUR_TEXT.fixed };
  const rgb = commit.rgb.toLowerCase() as Rgb;
  const text = formatSwatchColor(rgb, commit.alpha);
  const name = nextName(slot, commit.name, text);
  if (rgb === slot.rgb.toLowerCase() && commit.alpha === swatchAlpha(slot) && name === undefined) return { ok: true, message: RECOLOUR_TEXT.same };
  const options = { bankId: target.bank.id, swatchId: slot.id, rgb, alpha: commit.alpha, ...(name === undefined ? {} : { name }) };
  const steps = [{ name: COMMAND_NAME.swatchUpdate, targets: null, options }];
  return runPanelSteps({ target, label: RECOLOUR_LABEL, steps, done: RECOLOUR_TEXT.done(commit.index, text) });
};

export { commitSwatch };
