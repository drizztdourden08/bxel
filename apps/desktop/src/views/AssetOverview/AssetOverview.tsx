/* @layer renderer-app @kind component */
import { Grid, Stack } from '@drizztdourden08/tessera';
import { ASSET_TEXT } from '../../asset-config/asset-config.constants';
import { ConfigEmpty } from '../ConfigEmpty';
import { useAssetOverview } from './behavior/useAssetOverview';
import { ActionsPanel } from './sub-components/ActionsPanel';
import { DetailsPanel } from './sub-components/DetailsPanel';
import { LinksPanel } from './sub-components/LinksPanel';
import { PreviewPanel } from './sub-components/PreviewPanel';
import './AssetOverview.css';

const AssetOverview = () => {
  const model = useAssetOverview();
  if (model === null) return <ConfigEmpty title={ASSET_TEXT.noAssetTitle} message={ASSET_TEXT.noAsset} />;
  return (
    <Grid className="asset-overview" minColWidth={320} gap="md">
      <PreviewPanel model={model} />
      <Stack gap="md">
        <DetailsPanel model={model} />
        <ActionsPanel model={model} />
        <LinksPanel model={model} />
      </Stack>
    </Grid>
  );
};

export { AssetOverview };
