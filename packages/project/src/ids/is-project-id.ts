/* @layer core @kind logic */
import { PROJECT_ID_REGEX } from './id.constants';
import type { ProjectId } from './id.type';

const isProjectId = (value: unknown): value is ProjectId =>
  typeof value === 'string' && PROJECT_ID_REGEX.test(value);

export { isProjectId };
