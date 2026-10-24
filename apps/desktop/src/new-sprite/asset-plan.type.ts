/* @layer renderer-app @kind types */
import type { Artwork, AssetKey, CommandStep } from '@bxel/document';
import type { CreationForm } from './new-sprite.type';

interface PlanInput {
  form: CreationForm;
  artwork: Artwork;
  bankId: string | null;
}

interface AssetPlan {
  steps: readonly CommandStep[];
  keyOf: (created: Readonly<Record<string, unknown>>) => AssetKey | null;
}

type AssetCreation = { ok: true; key: AssetKey | null; names: readonly string[] } | { ok: false; message: string };

export type { AssetCreation, AssetPlan, PlanInput };
