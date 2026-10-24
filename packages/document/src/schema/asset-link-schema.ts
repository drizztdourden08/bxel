/* @layer core @kind logic */
import { z } from 'zod';

const isRelativePath = (path: string): boolean =>
  !path.startsWith('/') && !path.includes('\\') && !path.includes('\0') && !/^[a-zA-Z]:/.test(path);

const assetLinkSchema = z.object({
  id: z.string().min(1).max(128),
  path: z
    .string()
    .min(1)
    .max(1024)
    .refine(isRelativePath, { message: 'A link path is relative to the file that holds it.' }),
});

export { assetLinkSchema };
