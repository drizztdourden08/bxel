/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useCallback, useMemo } from 'react';
import { FILE_VIEW_DEFAULT, PALETTE_VIEW_DEFAULTS } from '../../../palette-view/palette-view.constants';
import type { PaletteViewState } from '../../../palette-view/palette-view.type';
import type { AppSettings } from '../../../settings.type';
import type { PaletteViewModel } from '../PalettePanel.type';

const usePaletteView = (onFile: boolean): PaletteViewModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const saved = settings.palettePanel;
  const state = useMemo<PaletteViewState>(() => {
    const view = onFile ? (saved?.fileView ?? FILE_VIEW_DEFAULT) : (saved?.view ?? PALETTE_VIEW_DEFAULTS.view);
    return { ...PALETTE_VIEW_DEFAULTS, ...saved, view };
  }, [saved, onFile]);
  const change = useCallback(
    (next: Partial<PaletteViewState>) => {
      const { view, ...rest } = next;
      const chosen = view === undefined ? {} : onFile ? { fileView: view } : { view };
      patch({ palettePanel: { ...saved, ...rest, ...chosen } });
    },
    [patch, saved, onFile],
  );
  return { ...state, change };
};

export { usePaletteView };
