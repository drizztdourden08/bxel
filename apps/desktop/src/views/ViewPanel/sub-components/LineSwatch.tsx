/* @layer renderer-app @kind component */
import { Span } from '@drizztdourden08/tessera';
import type { CSSProperties } from 'react';
import type { LineSwatchProps } from '../ViewPanel.type';

type SwatchStyle = CSSProperties & Record<'--swatch-line' | '--swatch-gap', string>;

const LineSwatch = ({ colour, opacity, gap, label }: LineSwatchProps) => {
  const style: SwatchStyle = {
    '--swatch-line': `color-mix(in srgb, ${colour} ${Math.round(Math.min(1, opacity + 0.25) * 100)}%, transparent)`,
    '--swatch-gap': `${Math.max(3, Math.min(12, gap * 2))}px`,
  };
  return <Span className="view-panel__swatch" style={style} role="img" aria-label={label} />;
};

export { LineSwatch };
