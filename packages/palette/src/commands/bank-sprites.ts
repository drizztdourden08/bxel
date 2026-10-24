/* @layer core @kind logic */
import type { BankId, Project, Sprite } from '@bxel/document';

const bankSprites = (project: Project, bankId: BankId): Sprite[] => project.sprites.filter((sprite) => sprite.bankId === bankId);

export { bankSprites };
