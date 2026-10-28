/* @layer renderer-app @kind logic */
import { z } from 'zod';
import { DEFAULT_SORT, DEFAULT_VIEW, THUMB_STOPS } from './project-browser.constants';

const sortSchema = z
  .object({ key: z.enum(['name', 'kind', 'modified', 'folder', 'size', 'frames', 'usedBy']).catch('name'), descending: z.boolean().catch(false) })
  .catch(DEFAULT_SORT);

const browserViewSchema = z.object({
  view: z.enum(['grid', 'list', 'columns']).catch(DEFAULT_VIEW.view),
  size: z.number().int().refine((value) => THUMB_STOPS.includes(value)).catch(DEFAULT_VIEW.size),
  sort: sortSchema,
  preview: z.boolean().catch(DEFAULT_VIEW.preview),
  folder: z.string().nullable().catch(null),
  pinned: z.array(z.string()).catch([]),
  smart: z.array(z.object({ id: z.string(), name: z.string(), query: z.string() })).catch([]),
});

export { browserViewSchema };
