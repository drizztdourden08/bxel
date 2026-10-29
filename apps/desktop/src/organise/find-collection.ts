/* @layer renderer-app @kind logic */
import type { OrganiseCollection, ProjectOrganise } from '@bxel/project';

/** A collection by id, or by name without regard to case. */
const findCollection = (organise: ProjectOrganise, reference: string): OrganiseCollection | undefined => {
  const wanted = reference.trim().toLowerCase();
  return organise.collections.find((each) => each.id === reference) ?? organise.collections.find((each) => each.name.toLowerCase() === wanted);
};

export { findCollection };
