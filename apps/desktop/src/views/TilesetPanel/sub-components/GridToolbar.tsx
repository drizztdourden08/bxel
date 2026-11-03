/* @layer renderer-app @kind component */
import { Flex, Icon, IconButton, SearchInput, Select, Stack, Tag } from '@drizztdourden08/tessera';
import { sameChoice } from '../../../stores/same-choice';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import type { ThumbZoom } from '../../../stores/tileset-view-store.type';
import { choiceOptions } from '../behavior/choice-options';
import { FILTERS, TILESET_TEXT, ZOOMS } from '../TilesetPanel.constants';
import type { TilesetModelProps } from '../TilesetPanel.type';

const zoomValue = (zoom: ThumbZoom): string => String(zoom);

const GridToolbar = ({ model }: TilesetModelProps) => {
  const view = useTilesetViewStore();
  const animate = useTilemapStore((state) => state.animateTiles);
  const setAnimate = useTilemapStore((state) => state.setAnimateTiles);
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
        <IconButton label={TILESET_TEXT.animate} size="sm" active={animate} onClick={() => setAnimate(!animate)}>
          <Icon name="pixel-animation" size={16} />
        </IconButton>
      </Flex>
      <Flex gap="2xs" wrap role="group" aria-label={TILESET_TEXT.filters}>
        {FILTERS.map((filter) => (
          <Tag key={filter.value} selected={view.filters.includes(filter.value)} onSelect={() => view.toggleFilter(filter.value)}>
            {filter.label}
          </Tag>
        ))}
        {choiceOptions(model.tileset).map((option) => (
          <Tag key={`${option.field}:${option.value}`} selected={view.choices.some((each) => sameChoice(each, option))} onSelect={() => view.toggleChoice(option)}>
            {option.label}
          </Tag>
        ))}
      </Flex>
    </Stack>
  );
};

export { GridToolbar };
