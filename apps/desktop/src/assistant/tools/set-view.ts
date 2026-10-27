/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { selectionMask } from '../../editor/selection/selection-mask';
import { currentTarget } from '../../editor/current-target';
import type { ToolHandler } from '../assistant.type';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { SetViewInput } from './app-tool-input.type';
import { focusStep, pageStep } from './focus-step';
import { reply } from './reply';
import { selectionStep } from './selection-step';
import { selectionReply } from './selection-runs';
import { coloursStep, selectStep, symmetryStep, toolStep } from './state-steps';
import type { ViewStep } from './view-steps.type';
import { panStep, playbackStep, togglesStep, zoomStep } from './zoom-step';

const STEPS: readonly (readonly [keyof SetViewInput, ViewStep])[] = [
  ['focus', focusStep],
  ['page', pageStep],
  ['zoom', zoomStep],
  ['pan', panStep],
  ['toggles', togglesStep],
  ['playback', playbackStep],
  ['select', selectStep],
  ['tool', toolStep],
  ['colours', coloursStep],
  ['symmetry', symmetryStep],
  ['selection', selectionStep],
];

const selectionNow = () => {
  const target = currentTarget();
  return selectionReply(target ? selectionMask(target) : null);
};

const setView: ToolHandler = (input, context) => {
  const patch = input as SetViewInput;
  const applied: string[] = [];
  for (const [field, step] of STEPS) {
    if (patch[field] === undefined) continue;
    const failed = step(patch, context);
    if (failed) return failed;
    applied.push(field);
  }
  const { displayName } = context.call.session;
  if (applied.length > 0) announce(APP_TOOL_TEXT.viewLine(displayName, `changed the view (${applied.join(', ')})`));
  return reply({
    ok: true,
    applied,
    visible: context.call.instance.window === 'visible',
    selection: applied.includes('selection') ? selectionNow() : null,
  });
};

export { setView };
