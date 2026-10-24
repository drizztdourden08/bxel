/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { BandBox } from '../../../sheet-manager/manager.type';

const tileBoxes = (container: HTMLElement): BandBox[] => {
  const origin = container.getBoundingClientRect();
  return Array.from(container.querySelectorAll<HTMLElement>('[data-sprite-id]')).map((tile) => {
    const box = tile.getBoundingClientRect();
    return {
      id: tile.dataset.spriteId as SpriteId,
      x: box.left - origin.left,
      y: box.top - origin.top,
      width: box.width,
      height: box.height,
    };
  });
};

export { tileBoxes };
