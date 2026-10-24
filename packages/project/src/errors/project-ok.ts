/* @layer core @kind logic */
import type { ProjectResult } from './project-result.type';

const projectOk = <T>(value: T): ProjectResult<T> => ({ ok: true, value });

export { projectOk };
