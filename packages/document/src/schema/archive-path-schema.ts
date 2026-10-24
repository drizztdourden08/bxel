/* @layer core @kind logic */
import { z } from 'zod';

const isSafePath = (path: string): boolean =>
  !path.startsWith('/') && !path.includes('\\') && !path.split('/').includes('..');

const archivePathSchema = z.string().min(1).refine(isSafePath, { message: 'A path stays inside the archive.' });

export { archivePathSchema };
