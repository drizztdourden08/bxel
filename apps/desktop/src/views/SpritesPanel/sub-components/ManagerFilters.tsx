/* @layer renderer-app @kind component */
import { Disclosure, DropdownMenu, Flex, Icon, IconButton, SearchInput, Stack } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { activeFilters } from '../../../sheet-manager/active-filters';
import { selectIds } from '../../../sheet-manager/select-ids';
import { useManagerStore } from '../../../stores/useManagerStore';
import { ActionHint } from '../../ActionHint';
import { filterGroups } from '../behavior/filter-groups';
import { sortGroups } from '../behavior/sort-groups';
import { SPRITE_HINTS } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { ViewControls } from './ViewControls';

const ManagerFilters = ({ model }: ManagerModelProps) => {
  const store = useManagerStore();
  const shownIds = model.shown.map((fact) => fact.sprite.id);
  const active = activeFilters(store.filter);
  return (
    <Disclosure summary={MANAGER_TEXT.findView} size="sm" defaultOpen={store.query !== '' || active > 0}>
      <Stack gap="xs">
        <Flex gap="xs" align="center">
          <SearchInput
            size="sm"
            value={store.query}
            placeholder={MANAGER_TEXT.searchHint}
            aria-label={MANAGER_TEXT.search}
            onChange={(query) => store.patch({ query })}
            onEnter={() => selectIds(shownIds)}
          />
          <ActionHint hint={SPRITE_HINTS.selectMatches}>
            <IconButton label={MANAGER_TEXT.selectMatches} size="sm" disabled={shownIds.length === 0} onClick={() => selectIds(shownIds)}>
              <Icon name="check" size={16} />
            </IconButton>
          </ActionHint>
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
            groups={filterGroups(store.filter, { sizes: model.sizes, tags: model.tags, banks: model.artwork.banks }, { patch: store.patchFilter, clear: store.clearFilters })}
          />
        </Flex>
      </Stack>
    </Disclosure>
  );
};

export { ManagerFilters };
