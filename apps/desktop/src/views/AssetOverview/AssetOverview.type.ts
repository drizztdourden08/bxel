/* @layer renderer-app @kind types */
import type { OverviewModel } from '../../asset-overview/asset-overview.type';

type OverviewPartProps = { readonly model: OverviewModel };

type NameDraft = {
  readonly draft: string;
  readonly error: string | null;
  readonly setDraft: (value: string) => void;
  readonly commit: (value: string) => void;
};

export type { NameDraft, OverviewPartProps };
