/* @layer renderer-app @kind component */
import { OPAQUE_ALPHA } from '@bxel/document';
import { Box } from '@drizztdourden08/tessera';
import type { ColorBackingProps } from './ColorBacking.type';
import './ColorBacking.css';

const ColorBacking = ({ alpha, inline = false, className, children }: ColorBackingProps) => {
  const classes = ['color-backing', inline ? 'color-backing--inline' : '', alpha < OPAQUE_ALPHA ? 'color-backing--clear' : '', className ?? ''];
  return <Box className={classes.filter(Boolean).join(' ')}>{children}</Box>;
};

export { ColorBacking };
