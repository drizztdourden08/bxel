/* @layer renderer-app @kind component */
import { Button, DropdownMenu, Flex, SearchInput, Stack, Tag } from '@drizztdourden08/tessera';
import { activeFilters } from '../../../sheet-manager/active-filters';
import { selectEntries } from '../../../sheet-manager/select-ids';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { filterChips } from '../behavior/filter-chips';
import { filterGroups } from '../behavior/filter-groups';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { ViewControls } from './ViewControls';

const ManagerFilters = ({ model }: ManagerModelProps) => {
  const store = useManagerStore();
  const chips = filterChips(store.filter, model.artwork.banks, store.patchFilter);
  const active = activeFilters(store.filter);
  const matches = [...model.shown.map((fact) => fact.sprite.id)];
  const strips = model.animations.map((fact) => fact.key);
  return (
    <Stack gap="xs" className="sprites-panel__filters">
      <Flex gap="xs" align="center">
        <SearchInput
          size="sm"
          value={store.query}
          placeholder={SHEET_TEXT.searchHint}
          aria-label={SHEET_TEXT.search}
          onChange={(query) => store.patch({ query })}
          onEnter={() => selectEntries(matches, strips)}
        />
        <ViewControls />
        <DropdownMenu
          size="sm"
          label={SHEET_TEXT.filter}
          trigger={{ label: active > 0 ? `${SHEET_TEXT.filter} (${active})` : SHEET_TEXT.filter, icon: 'funnel', iconOnly: true }}
          groups={filterGroups(store.filter, { sizes: model.sizes, tags: model.tags, banks: model.artwork.banks }, { patch: store.patchFilter, clear: store.clearFilters })}
        />
      </Flex>
      {(chips.length > 0 || store.query !== '') && (
        <Flex gap="xs" align="center" wrap className="sprites-panel__chips">
          {chips.map((chip) => (
            <Tag key={chip.id} color="primary" name={chip.label} onRemove={chip.clear}>
              {chip.label}
            </Tag>
          ))}
          <Button size="xs" variant="ghost" onClick={store.clearFilters} aria-label={SHEET_TEXT.clearChips}>
            {SHEET_TEXT.clear}
          </Button>
        </Flex>
      )}
    </Stack>
  );
};

export { ManagerFilters };
