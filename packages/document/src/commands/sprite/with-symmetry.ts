/* @layer core @kind logic */
import type { Sprite, SpriteSymmetry } from '../../model/sprite.type';
import { NO_SYMMETRY } from './sprite-symmetry.constants';

const isDefault = (symmetry: SpriteSymmetry): boolean => (Object.keys(NO_SYMMETRY) as (keyof SpriteSymmetry)[]).every((key) => symmetry[key] === NO_SYMMETRY[key]);

const withSymmetry = (sprite: Sprite, symmetry: SpriteSymmetry): Sprite => {
  const { symmetry: _old, ...rest } = sprite;
  return isDefault(symmetry) ? rest : { ...rest, symmetry };
};

export { withSymmetry };
