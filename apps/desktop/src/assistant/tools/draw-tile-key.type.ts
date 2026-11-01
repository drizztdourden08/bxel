/* @layer renderer-app @kind types */
type Cell = { readonly width: number; readonly originX: number; readonly originY: number; readonly tileWidth: number; readonly tileHeight: number };

type GlyphPlace = { readonly left: number; readonly shadow: boolean };

export type { Cell, GlyphPlace };
