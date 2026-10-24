/* @layer core @kind logic */
import { z } from 'zod';
import { maskSchema } from './mask-schema';

const pixelsClearSchema = z.strictObject({ mask: maskSchema });

export { pixelsClearSchema };
