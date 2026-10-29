/* @layer core @kind logic */
import type { ProjectOrganise } from './organise.type';

const orderOrganise = (organise: ProjectOrganise) => ({
  tags: Object.fromEntries(
    Object.entries(organise.tags)
      .filter(([, names]) => names.length > 0)
      .sort(([left], [right]) => (left < right ? -1 : 1))
      .map(([id, names]) => [id, [...names]]),
  ),
  collections: organise.collections.map((each) => ({ id: each.id, name: each.name, assets: [...each.assets] })),
  smart: organise.smart.map((each) => ({ id: each.id, name: each.name, query: each.query })),
  pinned: [...organise.pinned],
});

export { orderOrganise };
