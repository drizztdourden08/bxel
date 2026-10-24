/* @layer renderer-app @kind component */
import { DropdownMenu, Flex, Icon, IconButton, SearchInput, Stack, Text, Tooltip } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { selectIds } from '../../../sheet-manager/select-ids';
import { useManagerStore } from '../../../stores/useManagerStore';
import { filterGroups } from '../behavior/filter-groups';
import { sortGroups } from '../behavior/sort-groups';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { ViewControls } from './ViewControls';

const ManagerFilters = ({ model }: ManagerModelProps) => {
  const store = useManagerStore();
  const active = [store.filter.animated, store.filter.unplaced, store.filter.size !== null].filter(Boolean).length;
  return (
    <Stack gap="xs">
      <Flex gap="xs" align="center">
        <SearchInput
          size="sm"
          value={store.query}
          placeholder={MANAGER_TEXT.searchHint}
          aria-label={MANAGER_TEXT.search}
          onChange={(query) => store.patch({ query })}
          onEnter={() => selectIds(model.order)}
        />
        <Tooltip content={MANAGER_TEXT.selectMatches} placement="bottom">
          <IconButton label={MANAGER_TEXT.selectMatches} size="sm" disabled={model.order.length === 0} onClick={() => selectIds(model.order)}>
            <Icon name="check" size={16} />
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex gap="xs" align="center" wrap>
        <ViewControls />
        <DropdownMenu
          size="sm"
          label={MANAGER_TEXT.sort}
          trigger={{ label: MANAGER_TEXT.sortLabels[store.sortKey], icon: 'arrow-up-down' }}
          groups={sortGroups(store.sortKey, store.sortDown, store.patch)}
        />
        <DropdownMenu
          size="sm"
          label={MANAGER_TEXT.filters}
          trigger={{ label: active > 0 ? `${MANAGER_TEXT.filters} (${active})` : MANAGER_TEXT.filters, icon: 'filter' }}
          groups={filterGroups(store.filter, model.sizes, { patch: store.patchFilter, clear: store.clearFilters })}
        />
      </Flex>
      <Text variant="caption" tone="dim">
        {MANAGER_TEXT.shown(model.shown.length, model.facts.length)}
      </Text>
    </Stack>
  );
};

export { ManagerFilters };
