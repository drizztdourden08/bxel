/* @layer renderer-app @kind types */
type ViewSectionId = 'navigator' | 'zoom' | 'preview' | 'overlays' | 'guides' | 'onion' | 'tiled' | 'symmetry' | 'reference' | 'background';

interface ViewSectionArgs {
  section: ViewSectionId;
}

export type { ViewSectionArgs, ViewSectionId };
