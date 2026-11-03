/* @layer renderer-app @kind logic */
import { SPRITE_REF } from './image-import.constants';

const spriteRef = (index: number): string => `${SPRITE_REF}-${index}`;

export { spriteRef };
