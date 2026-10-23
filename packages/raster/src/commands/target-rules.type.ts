/* @layer core @kind types */
import type { Project, SpriteId } from '@bxel/document';
import type { MaskView } from '../buffer.type';

type TargetRules = {
  readonly project: Project;
  readonly sprites: readonly SpriteId[];
  readonly index: number;
  readonly mask: MaskView | undefined;
};

export type { TargetRules };
