/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';

/** Hands the colour tag of a row to its stylesheet as a custom property. */
const layerTagStyle = (hex: string | null): CSSProperties | undefined => (hex === null ? undefined : ({ '--layer-tag': hex } as CSSProperties));

export { layerTagStyle };
