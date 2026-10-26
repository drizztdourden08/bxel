/* @layer core @kind test */
import { RETIRED_MESSAGE } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { buildAnimWorld, refuse } from './anim-engine';
import { step } from './tile-engine';

const RETIRED = [
  'frame.add',
  'frame.delete',
  'frame.duplicate',
  'frame.reorder',
  'frame.update',
  'tag.add',
  'tag.update',
  'tag.delete',
  'cel.clear',
  'cel.copy',
  'cel.move',
  'cel.link',
  'cel.unlink',
  'sprite.merge',
  'sprite.split',
];

describe('retired sprite frame commands', () => {
  it.each(RETIRED)('%s is refused with the animation hint', (name) => {
    const { engine } = buildAnimWorld();
    const error = refuse(engine, [step(name, {})]);
    expect(error.code).toBe('INVALID_OPTION');
    expect(error.message).toBe(RETIRED_MESSAGE);
    expect(error.message).toBe('Sprites are still images. Use an animation for frames.');
  });

  it('still reports a command that never existed as unknown', () => {
    const { engine } = buildAnimWorld();
    expect(refuse(engine, [step('frame.fly', {})]).code).toBe('UNKNOWN_COMMAND');
  });
});
