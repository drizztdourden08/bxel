/* @layer renderer-app @kind logic */
import { useSwatchGridStore } from '../../../stores/useSwatchGridStore';
import type { PanelModel } from '../PalettePanel.type';
import { revealNewSwatch } from './reveal-new-swatch';

const revealFromStore = (panel: PanelModel, index: number): void => revealNewSwatch(panel, { current: useSwatchGridStore.getState().handle }, index);

export { revealFromStore };
