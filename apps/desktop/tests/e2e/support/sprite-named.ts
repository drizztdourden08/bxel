/* @layer renderer-app @kind logic */
import type { Engine, Sprite } from '@bxel/document';

const spriteNamed = (engine: Engine, name: string): Sprite => {
  const found = engine.state().artwork.sprites.find((sprite) => sprite.name === name);
  if (!found) throw new Error(`no sprite named ${name}`);
  return found;
};

export { spriteNamed };
