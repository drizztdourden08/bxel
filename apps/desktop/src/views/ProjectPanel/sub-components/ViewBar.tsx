/* @layer renderer-app @kind component */
import { SearchInput, SegmentedControl, Stack } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../asset-list/asset-list-text.constants';
import type { PanelPartProps, PanelView } from '../ProjectPanel.type';

const ViewBar = ({ model }: PanelPartProps) => (
  <Stack gap="xs">
    <SegmentedControl<PanelView>
      label={ASSET_LIST_TEXT.viewLabel}
      value={model.view}
      onChange={model.setView}
      options={[
        { value: 'assets', label: ASSET_LIST_TEXT.assetsView },
        { value: 'folders', label: ASSET_LIST_TEXT.foldersView },
      ]}
    />
    <SearchInput aria-label={ASSET_LIST_TEXT.searchLabel} placeholder={ASSET_LIST_TEXT.searchPlaceholder} value={model.search} onChange={model.setSearch} />
  </Stack>
);

export { ViewBar };
