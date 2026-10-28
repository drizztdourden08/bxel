/* @layer renderer-app @kind constants */
import type { SetViewInput } from './app-tool-input.type';
import { coloursStep } from './colours-step';
import { dialogStep } from './dialog-step';
import { focusStep } from './focus-step';
import { panStep } from './pan-step';
import { pageStep } from './page-step';
import { playbackStep } from './playback-step';
import { selectStep } from './select-step';
import { selectionStep } from './selection-step';
import { symmetryStep } from './symmetry-step';
import { togglesStep } from './toggles-step';
import { toolStep } from './tool-step';
import type { ViewStep } from './view-steps.type';
import { zoomStep } from './zoom-step';

const VIEW_STEPS: readonly (readonly [keyof SetViewInput, ViewStep])[] = [
  ['dialog', dialogStep],
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

export { VIEW_STEPS };
