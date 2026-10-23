/* @layer core @kind logic */
import type { SpriteId } from '../model/ids.type';
import type { Project } from '../model/project.type';
import type { Sprite } from '../model/sprite.type';

const findSprite = (project: Project, id: SpriteId): Sprite | undefined =>
  project.sprites.find((sprite) => sprite.id === id);

export { findSprite };
