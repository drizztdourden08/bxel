/* @layer renderer-app @kind logic */
import { artworkCreate, counterIdSource, createEngine, documentCommands } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { ANIMATION_COLORS } from './animation.constants';

type StartOptions = { readonly name: string; readonly palette: string; readonly sprite: { readonly name: string; readonly width: number; readonly height: number } };

const startEngine = ({ name, palette, sprite }: StartOptions): Engine => {
  const ids = counterIdSource();
  const created = artworkCreate({ options: { name, bank: { name: palette, cap: 16, transparent: true, colors: ANIMATION_COLORS }, sprite }, ids });
  if (!created.ok) throw new Error(created.error.message);
  return createEngine({ state: created.state, ids, commands: documentCommands });
};

export { startEngine };
