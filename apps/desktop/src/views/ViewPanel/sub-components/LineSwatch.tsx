/* @layer renderer-app @kind component */
import { Span } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useElementStyle } from '../../../hooks/useElementStyle';
import { swatchStyle } from '../behavior/swatch-style';
import type { LineSwatchProps } from '../ViewPanel.type';

const LineSwatch = ({ colour, opacity, gap, label }: LineSwatchProps) => {
  const box = useRef<HTMLSpanElement>(null);
  useElementStyle(box, swatchStyle(colour, opacity, gap));
  return <Span ref={box} className="view-panel__swatch" role="img" aria-label={label} />;
};

export { LineSwatch };
