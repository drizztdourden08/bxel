/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, SearchInput, Select, Stack, Tag } from '@drizztdourden08/tessera';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { ThumbZoom } from '../../../stores/tileset-view-store.type';
import { FILTERS, TILESET_TEXT, ZOOMS } from '../TilesetPanel.constants';

const zoomValue = (zoom: ThumbZoom): string => String(zoom);

const GridToolbar = () => {
  const view = useTilesetViewStore();
  return (
    <Stack gap="xs" role="search" aria-label={TILESET_TEXT.search}>
      <Flex gap="xs" align="center" wrap>
        <SearchInput
          id={TILESET_TEXT.searchId}
          size="sm"
          grow
          aria-label={TILESET_TEXT.search}
          placeholder={TILESET_TEXT.searchHint}
          value={view.search}
          onChange={view.setSearch}
          onKeyDown={(event) => event.key === 'Escape' && view.setSearch('')}
        />
        <Select
          size="sm"
          aria-label={TILESET_TEXT.zoom}
          options={ZOOMS.map((choice) => ({ value: zoomValue(choice.zoom), label: choice.label }))}
          value={zoomValue(view.zoom)}
          onChange={(value) => view.setZoom(value === 'fit' ? 'fit' : (Number(value) as ThumbZoom))}
        />
        <IconButton label={TILESET_TEXT.keys} size="sm" active={view.showKeys} onClick={() => view.setShowKeys(!view.showKeys)}>
          <Icon name="hash" size={16} />
        </IconButton>
        <IconButton label={TILESET_TEXT.uses} size="sm" active={view.showUses} onClick={() => view.setShowUses(!view.showUses)}>
          <Icon name="eye" size={16} />
        </IconButton>
      </Flex>
      <Flex gap="2xs" wrap role="group" aria-label={TILESET_TEXT.filters}>
        {FILTERS.map((filter) => (
          <Tag key={filter.value} selected={view.filters.includes(filter.value)} onSelect={() => view.toggleFilter(filter.value)}>
            {filter.label}
          </Tag>
        ))}
      </Flex>
    </Stack>
  );
};

export { GridToolbar };
