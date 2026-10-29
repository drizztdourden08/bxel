/* @layer core @kind logic */
import type { Guides } from '../../model/sprite.type';
import { copyGuides } from './copy-guides';

const withGuides = <Held extends { readonly guides?: Guides }>(current: Held, guides: Guides): Omit<Held, 'guides'> & { readonly guides?: Guides } => {
  const { guides: _old, ...rest } = current;
  const copy = copyGuides(guides);
  return copy ? { ...rest, guides: copy } : rest;
};

export { withGuides };
