/* @layer core @kind types */
import type { Project, SpriteId } from '@bxel/document';

type RampRequest = {
  readonly project: Project;
  readonly sprites: readonly SpriteId[];
  readonly name: string;
  readonly needs: number;
};

export type { RampRequest };
