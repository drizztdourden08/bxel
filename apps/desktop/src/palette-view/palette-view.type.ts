/* @layer renderer-app @kind types */
type PaletteViewKind = 'grid' | 'list' | 'ramps';

type SwatchSize = 16 | 24 | 32;

type UsageScope = 'sprite' | 'palette';

interface PalettePanelSettings {
  view?: PaletteViewKind;
  size?: SwatchSize;
  showUse?: boolean;
  scope?: UsageScope;
}

interface PaletteViewState {
  view: PaletteViewKind;
  size: SwatchSize;
  showUse: boolean;
  scope: UsageScope;
}

export type { PalettePanelSettings, PaletteViewKind, PaletteViewState, SwatchSize, UsageScope };
