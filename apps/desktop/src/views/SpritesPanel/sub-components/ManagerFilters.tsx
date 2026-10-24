/* @layer renderer-app @kind component */
import { DropdownMenu, Flex, Icon, IconButton, SearchInput, Stack, Text } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
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
  const active = [store.filter.animated, store.filter.unplaced, store.filter.size !== null, store.filter.identical !== 'off'].filter(Boolean).length;
  return (
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
