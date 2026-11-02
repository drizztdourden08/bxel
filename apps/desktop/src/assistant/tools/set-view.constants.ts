/* @layer renderer-app @kind constants */
import type { SetViewInput } from './app-tool-input.type';
import { coloursStep } from './colours-step';
import { dialogStep } from './dialog-step';
import { focusStep } from './focus-step';
import { markerStep } from './marker-step';
import { panStep } from './pan-step';
import { browseStep } from './browse-step';
import { pageStep } from './page-step';
import { projectPanelStep } from './project-panel-step';
import { propertiesStep } from './properties-step';
import { referencesStep } from './references-step';
import { revealStep } from './reveal-step';
import { tilesetStep } from './tileset-step';
import { playbackStep } from './playback-step';
import { selectStep } from './select-step';
import { mapSelectionStep } from './map-selection-step';
import { selectionStep } from './selection-step';
import { spritesStep } from './sprites-step';
import { symmetryStep } from './symmetry-step';
import { togglesStep } from './toggles-step';
import { timelineStep } from './timeline-step';
import { toolStep } from './tool-step';
import type { ViewStep } from './view-steps.type';
import { windowStep } from './window-step';
import { zoomStep } from './zoom-step';

const VIEW_STEPS: readonly (readonly [keyof SetViewInput, ViewStep])[] = [
  ['dialog', dialogStep],
  ['focus', focusStep],
  ['page', pageStep],
  ['window', windowStep],
  ['properties', propertiesStep],
  ['browse', browseStep],
  ['reveal', revealStep],
  ['projectPanel', projectPanelStep],
  ['sprites', spritesStep],
  ['tileset', tilesetStep],
  ['zoom', zoomStep],
  ['pan', panStep],
  ['marker', markerStep],
  ['toggles', togglesStep],
  ['playback', playbackStep],
  ['timeline', timelineStep],
  ['select', selectStep],
  ['tool', toolStep],
  ['colours', coloursStep],
  ['references', referencesStep],
  ['symmetry', symmetryStep],
  ['selection', selectionStep],
  ['mapSelection', mapSelectionStep],
];

export { VIEW_STEPS };
