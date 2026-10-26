/* @layer core @kind logic */
import type { Sprite } from '../../model/sprite.type';
import { EMPTY_GUIDES } from './guide.constants';
import type { GuideAxis } from './guide.type';

const guideLine = (sprite: Sprite, axis: GuideAxis): readonly number[] => (sprite.guides ?? EMPTY_GUIDES)[axis];

export { guideLine };
