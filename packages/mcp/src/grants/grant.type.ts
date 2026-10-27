/* @layer core @kind types */
import type { BundleId, Level, ToolRowId } from '../catalogue/catalogue.type';

type Grant = {
  readonly v: 1;
  readonly blocked: boolean;
  readonly bundles: Readonly<Record<BundleId, Level>>;
  readonly tools: Readonly<Partial<Record<ToolRowId, Level>>>;
  readonly special: { readonly mayRestart: boolean };
};

export type { Grant };
