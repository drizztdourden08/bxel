/* @layer renderer-app @kind types */
import type { PaletteBank } from '@bxel/document';
import type { RampBuild, RampHueMode } from '@bxel/palette';
import type { EditorTarget } from '../../editor/editor.type';
import type { RampBuilderRequest } from '../../stores/palette-panel-store.type';

interface BuilderSettings {
  baseIndex: number;
  light: number;
  dark: number;
  hueShift: number;
  hueMode: RampHueMode;
  chromaCurve: boolean;
  snap: boolean;
  span: readonly [number, number];
  name: string;
}

interface BuilderState {
  target: EditorTarget;
  bank: PaletteBank;
  settings: BuilderSettings;
  change: (next: Partial<BuilderSettings>) => void;
  build: RampBuild | null;
  free: number;
  fits: boolean;
  failure: string | null;
  apply: () => void;
  cancel: () => void;
}

interface BuilderDialogProps {
  request: RampBuilderRequest;
  live: EditorTarget;
}

interface BuilderPartProps {
  state: BuilderState;
}

export type { BuilderDialogProps, BuilderPartProps, BuilderSettings, BuilderState };
