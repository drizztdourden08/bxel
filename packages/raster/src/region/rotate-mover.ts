/* @layer core @kind logic */
import { maskSource } from './mask-source';
import type { Mover } from './region.type';
import { rotatedBox } from './rotated-box';
import { rotationTerms } from './rotation-terms';

const rotateMover =
  (degrees: number): Mover =>
  ({ mask, box, pivot }) => {
    const terms = rotationTerms(degrees);
    const centerX = pivot.x2 / 2;
    const centerY = pivot.y2 / 2;
    return {
      area: rotatedBox(box, pivot, terms),
      source: (x, y) => {
        const dx = x + 0.5 - centerX;
        const dy = y + 0.5 - centerY;
        return maskSource(
          mask,
          Math.floor(centerX + terms.cos * dx + terms.sin * dy),
          Math.floor(centerY - terms.sin * dx + terms.cos * dy),
        );
      },
    };
  };

export { rotateMover };
