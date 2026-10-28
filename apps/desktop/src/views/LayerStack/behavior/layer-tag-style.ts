/* @layer renderer-app @kind logic */
import type { CSSProperties } from 'react';

const layerTagStyle = (hex: string | null): CSSProperties | undefined => (hex === null ? undefined : ({ '--layer-tag': hex } as CSSProperties));

export { layerTagStyle };
