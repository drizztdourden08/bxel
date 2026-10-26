/* @layer renderer-app @kind logic */
import { artworkCreate, counterIdSource, createEngine, documentCommands, legacyFrameCommands } from '@bxel/document';
import type { Engine } from '@bxel/document';
import { DEMO_COLOURS, DEMO_NAME, DEMO_PALETTE, SIDE } from './demo-art.constants';

const startDemoEngine = (): Engine => {
  const ids = counterIdSource();
  const first = { name: 'hero', width: SIDE, height: SIDE };
  const bank = { name: DEMO_PALETTE, cap: 16, transparent: true, colors: [...DEMO_COLOURS] };
  const started = artworkCreate({ options: { name: DEMO_NAME, bank, sprite: first }, ids });
  if (!started.ok) throw new Error(started.error.message);
  return createEngine({ state: started.state, ids, commands: [...documentCommands, ...legacyFrameCommands] });
};

export { startDemoEngine };
