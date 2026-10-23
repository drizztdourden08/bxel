/* @layer core @kind logic */
import type { Project } from '../model/project.type';
import type { Sprite } from '../model/sprite.type';

const replaceSprite = (project: Project, sprite: Sprite): Project => ({
  ...project,
  sprites: project.sprites.map((item) => (item.id === sprite.id ? sprite : item)),
});

export { replaceSprite };
