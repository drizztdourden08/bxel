/* @layer renderer-app @kind component */
import { Grid, Stack } from '@drizztdourden08/tessera';
import { SUBJECT_TEXT } from '../../properties-subject/properties-subject.constants';
import { ConfigEmpty } from '../ConfigEmpty';
import { SubjectCard } from '../SubjectCard';
import { useAssetOverview } from './behavior/useAssetOverview';
import { DetailsPanel } from './sub-components/DetailsPanel';
import { LinksPanel } from './sub-components/LinksPanel';

const AssetOverview = () => {
  const model = useAssetOverview();
  if (model === null) return <ConfigEmpty title={SUBJECT_TEXT.emptyTitle} message={SUBJECT_TEXT.emptyMessage} />;
  return (
    <Grid className="asset-overview" minColWidth={320} gap="md">
      <SubjectCard />
      <Stack gap="md">
        <DetailsPanel model={model} />
        <LinksPanel model={model} />
      </Stack>
    </Grid>
  );
};

export { AssetOverview };
