/* @layer renderer-app @kind types */
type AssetState = 'unsaved' | 'open' | 'missing' | 'unused';

type MissingLink = { readonly linkId: string; readonly targetName: string; readonly state: string };

type AssetLinks = { readonly uses: readonly string[]; readonly missing: readonly MissingLink[] };

export type { AssetLinks, AssetState, MissingLink };
