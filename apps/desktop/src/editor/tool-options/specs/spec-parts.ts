/* @layer renderer-app @kind logic */
import type { SpecInput } from './drawing-spec.type';

const specParts = (input: SpecInput) => ({
  id: `${input.surface === 'map' ? 'map.' : ''}${input.tool}.${input.name}`,
  name: input.name,
  tool: input.tool,
  surface: input.surface ?? ('paint' as const),
  memory: 'global' as const,
  label: input.label,
  description: input.description,
  tier: input.tier ?? (1 as const),
  priority: input.priority,
  group: input.group,
  ...(input.command === undefined ? {} : { command: input.command }),
  ...(input.chord === undefined ? {} : { chord: input.chord }),
  ...(input.display === undefined ? {} : { display: input.display }),
  ...(input.appliesWhen === undefined ? {} : { appliesWhen: input.appliesWhen }),
});

export { specParts };
