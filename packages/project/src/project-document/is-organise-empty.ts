/* @layer core @kind logic */
import type { ProjectOrganise } from './organise.type';

const isOrganiseEmpty = (organise: ProjectOrganise): boolean =>
  Object.keys(organise.tags).length === 0 && organise.collections.length === 0 && organise.smart.length === 0 && organise.pinned.length === 0;

export { isOrganiseEmpty };
