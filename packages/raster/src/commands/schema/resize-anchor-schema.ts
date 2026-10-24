/* @layer core @kind logic */
import { z } from 'zod';

const resizeAnchorSchema = z.enum(['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']);

export { resizeAnchorSchema };
