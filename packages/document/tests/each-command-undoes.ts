/* @layer core @kind helper */
import type { CommandStep } from '@bxel/document';
import { it } from 'vitest';
import { step } from './tile-engine';

const eachCommandUndoes = <World>(
  populated: () => World,
  commands: (world: World) => Record<string, CommandStep>,
  check: (world: World, name: string, chosen: CommandStep) => void,
): void => {
  const names = Object.keys(commands(populated()));

  it.each(names)('%s undoes and redoes as one step', (name) => {
    const world = populated();
    check(world, name, commands(world)[name] ?? step('none', {}));
  });
};

export { eachCommandUndoes };
