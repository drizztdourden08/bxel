/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import { PALETTE_VIEW_DEFAULTS } from '../../../palette-view/palette-view.constants';
import type { PaletteViewState } from '../../../palette-view/palette-view.type';
import type { AppSettings } from '../../../settings.type';
import type { PaletteViewModel } from '../PalettePanel.type';

const usePaletteView = (): PaletteViewModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const saved = settings.palettePanel;
  const state = useMemo<PaletteViewState>(() => ({ ...PALETTE_VIEW_DEFAULTS, ...saved }), [saved]);
  const change = useCallback((next: Partial<PaletteViewState>) => patch({ palettePanel: { ...saved, ...next } }), [patch, saved]);
  return { ...state, change };
};

export { usePaletteView };
