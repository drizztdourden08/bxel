/* @layer renderer-app @kind component */
import { Flex, Select, Stack, Tag } from '@drizztdourden08/tessera';
import { CHIP_OPTIONS, SORT_OPTIONS } from '../../../../../asset-list/asset-list.constants';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import type { AssetsPartProps } from '../AssetsView.type';

const AssetFilters = ({ model }: AssetsPartProps) => {
  const pickSort = (value: string): void => {
    const found = SORT_OPTIONS.find((option) => option.value === value);
    if (found) model.setSort(found.value);
  };
  return (
    <Stack gap="xs">
      <Flex gap="xs" wrap role="radiogroup" aria-label={ASSET_LIST_TEXT.chipsLabel}>
        {CHIP_OPTIONS.map((option) => (
          <Tag key={option.value} role="radio" selected={model.query.chip === option.value} onSelect={() => model.setChip(option.value)}>
            {`${option.label} ${model.counts.find((each) => each.chip === option.value)?.count ?? 0}`}
          </Tag>
        ))}
      </Flex>
      <Select
        aria-label={ASSET_LIST_TEXT.sortLabel}
        value={model.query.sort}
        onChange={pickSort}
        options={SORT_OPTIONS.map((option) => ({ value: option.value, label: `${ASSET_LIST_TEXT.sortLabel} ${option.label.toLowerCase()}` }))}
      />
    </Stack>
  );
};

export { AssetFilters };
