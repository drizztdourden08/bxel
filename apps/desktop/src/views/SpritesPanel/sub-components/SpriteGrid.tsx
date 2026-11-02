/* @layer renderer-app @kind component */
import { Box, MarqueeBox, VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridCellBind, VirtualGridHandle } from '@drizztdourden08/tessera';
import { useMemo, useRef } from 'react';
import type { WheelEvent } from 'react';
import { wheelBox } from '../../../sheet-manager/wheel-box';
import { entryId } from '../../../sheet-manager/entry-id';
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import { useManagerStore } from '../../../stores/useManagerStore';
import { activeIndex } from '../behavior/active-index';
import { animationSection } from '../behavior/animation-section';
import { gridColumns } from '../behavior/grid-columns';
import { gridSection } from '../behavior/grid-section';
import { useScrollToActive } from '../behavior/useScrollToActive';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { visibleGroups } from '../behavior/visible-groups';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { tileSize } from '../../EntryTile';
import { GridTile } from './GridTile';
import { entryName } from '../../../sheet-manager/entry-name';
import { entryWarnings } from '../../../sheet-manager/entry-warnings';

const SpriteGrid = (props: SpriteGridProps) => {
  const { model, box } = props;
  const grid = useRef<VirtualGridHandle>(null);
  const marquee = useSpriteMarquee(model, grid);
  const closed = useManagerStore((state) => state.collapsed);
  const sortKey = useManagerStore((state) => state.sortKey);
  const pageSide = useManagerStore((state) => state.atlas.pageSide);
  const warnings = useMemo(() => entryWarnings(model.facts, pageSide), [model.facts, pageSide]);
  const toggle = useManagerStore((state) => state.toggleFolder);
  const groups = visibleGroups(model.groups);
  useScrollToActive(grid, activeIndex(groups, model.scene.active?.id ?? null));
  const size = tileSize(box);
  const common = {
    label: 'Sprites',
    getKey: entryId,
    getLabel: entryName,
    renderTile: (fact: EntryFacts, _index: number, cell: VirtualGridCellBind) => <GridTile view={props} fact={fact} cell={cell} warning={fact.kind === 'sprite' ? warnings.get(fact.sprite.id) : undefined} />,
    scrollRef: marquee.area,
    bind: { onPointerDown: marquee.onPointerDown },
    overlay: <MarqueeBox rect={marquee.rect} />,
    ref: grid,
    tileWidth: size.width,
    tileHeight: size.height,
  };
  const onWheel = (event: WheelEvent<HTMLElement>) => {
    if (event.ctrlKey) useManagerStore.getState().patch({ zoom: wheelBox(box, event.deltaY) });
  };
  const fixed = gridColumns(model, sortKey);
  const onlyRoot = groups.length === 1 && groups[0]?.path === '';
  return (
    <Box className="sprites-panel__virtual" onClick={marquee.onClick} onWheel={onWheel}>
      {onlyRoot ? (
        <VirtualGrid {...common} {...(fixed === undefined ? {} : { columns: fixed })} items={[...groups.flatMap((group): EntryFacts[] => [...group.facts]), ...model.animations]} />
      ) : (
        <VirtualGrid
          {...common}
          sections={[...groups.map((group) => gridSection(group, groups.map((each) => each.path).filter((path) => path !== group.path && path !== ''))), ...animationSection(model.animations)]}
          collapsed={closed}
          onToggleSection={(path) => toggle(path)}
        />
      )}
    </Box>
  );
};

export { SpriteGrid };
