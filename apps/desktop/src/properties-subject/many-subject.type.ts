/* @layer renderer-app @kind types */
type ManyItem = {
  readonly id: string;
  readonly name: string;
  readonly path: string;
  readonly kind: string;
  readonly assetId: string | null;
  readonly folder: boolean;
};

type ManySubject = { readonly items: readonly ManyItem[]; readonly tabId: string | null };

interface ManyStoreState {
  readonly many: ManySubject | null;
  readonly show: (many: ManySubject) => void;
  readonly clear: () => void;
}

type TagSplit = { readonly shared: readonly string[]; readonly partial: readonly string[] };

export type { ManyItem, ManyStoreState, TagSplit };
