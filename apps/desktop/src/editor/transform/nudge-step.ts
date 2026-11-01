/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import { NUDGE_STEP_FAST } from '../selection/selection.constants';

const nudgeStep = (fast: boolean): number => (fast ? NUDGE_STEP_FAST : useSelectionStore.getState().nudge);

export { nudgeStep };
