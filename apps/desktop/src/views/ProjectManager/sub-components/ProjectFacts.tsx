/* @layer renderer-app @kind component */
import { PanelContainer, Stack, StatRow } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../project-manager/project-manager.constants';
import type { ProjectFact } from '../../../project-manager/project-manager.type';

const ProjectFacts = ({ facts }: { readonly facts: readonly ProjectFact[] }) => (
  <PanelContainer title={MANAGER_TEXT.factsTitle} level={3}>
    <Stack gap="xs">
      {facts.map((fact) => (
        <StatRow key={fact.label} label={fact.label} value={fact.value} align="start" />
      ))}
    </Stack>
  </PanelContainer>
);

export { ProjectFacts };
