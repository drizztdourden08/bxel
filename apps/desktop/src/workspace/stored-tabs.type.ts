/* @layer renderer-app @kind types */
type StoredTabs = { readonly open: readonly string[]; readonly active: string | null };

type StoredTabsMap = Readonly<Record<string, StoredTabs>>;

export type { StoredTabs, StoredTabsMap };
