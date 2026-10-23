/* @layer core @kind logic */
import type { Sprite } from '../model/sprite.type';
import type { Draft } from './draft.type';
import { updateProject } from './update-project';

const addSprite = (draft: Draft, sprite: Sprite): void => {
  updateProject(draft, (project) => ({ ...project, sprites: [...project.sprites, sprite] }));
};

export { addSprite };
