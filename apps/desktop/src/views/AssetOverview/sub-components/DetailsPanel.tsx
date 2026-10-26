/* @layer renderer-app @kind component */
import { PanelContainer, Stack, StatRow } from '@drizztdourden08/tessera';
import { OVERVIEW_TEXT } from '../../../asset-overview/asset-overview.constants';
import type { OverviewPartProps } from '../AssetOverview.type';
import { NameField } from './NameField';

const DetailsPanel = ({ model }: OverviewPartProps) => (
  <PanelContainer title={OVERVIEW_TEXT.detailsTitle} level={3}>
    <Stack gap="sm">
      <NameField key={`${model.focus.key.kind}:${model.focus.key.id}:${model.name}`} model={model} />
      {model.facts.map((fact) => (
        <StatRow key={fact.label} label={fact.label} value={fact.value} align="start" />
      ))}
    </Stack>
  </PanelContainer>
);

export { DetailsPanel };
