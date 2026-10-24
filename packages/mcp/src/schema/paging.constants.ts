/* @layer core @kind constants */
import { z } from 'zod';
import { LIST_ENTRIES_DEFAULT, LIST_ENTRIES_MAX } from '../limits/limits.constants';

const PAGING_SHAPE = {
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(LIST_ENTRIES_MAX).default(LIST_ENTRIES_DEFAULT),
};

export { PAGING_SHAPE };
