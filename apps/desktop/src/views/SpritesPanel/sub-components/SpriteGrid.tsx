/* @layer renderer-app @kind component */
import { Box, MarqueeBox, VirtualGrid } from '@drizztdourden08/tessera';
import type { VirtualGridHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import type { SpriteFacts } from '../../../sheet-manager/manager.type';
import { useManagerStore } from '../../../stores/useManagerStore';
import { activeIndex } from '../behavior/active-index';
import { gridSection } from '../behavior/grid-section';
import { tileSize } from '../behavior/tile-size';
import { useScrollToActive } from '../behavior/useScrollToActive';
import { useSpriteMarquee } from '../behavior/useSpriteMarquee';
import { visibleGroups } from '../behavior/visible-groups';
import type { SpriteGridProps } from '../SpritesPanel.type';
import { GridTile } from './GridTile';

const SpriteGrid = (props: SpriteGridProps) => {
  const { model, box } = props;
  const grid = useRef<VirtualGridHandle>(null);
  const marquee = useSpriteMarquee(model, grid);
  const closed = useManagerStore((state) => state.collapsed);
  const toggle = useManagerStore((state) => state.toggleFolder);
  const groups = visibleGroups(model.groups);
  useScrollToActive(grid, activeIndex(groups, model.scene.active?.id ?? null));
  const size = tileSize(box);
  const common = {
    label: 'Sprites',
    getKey: (fact: SpriteFacts) => fact.sprite.id,
    renderItem: (fact: SpriteFacts) => <GridTile view={props} fact={fact} />,
    scrollRef: marquee.area,
    bind: { onPointerDown: marquee.onPointerDown },
    overlay: <MarqueeBox rect={marquee.rect} />,
    ref: grid,
    tileWidth: size.width,
    tileHeight: size.height,
  };
  const onlyRoot = groups.length === 1 && groups[0]?.path === '';
  return (
    <Box className="sprites-panel__virtual" onClick={marquee.onClick}>
      {onlyRoot ? (
        <VirtualGrid {...common} items={groups.flatMap((group) => group.facts)} />
      ) : (
        <VirtualGrid
          {...common}
          sections={groups.map(gridSection)}
          collapsed={closed}
          onToggleSection={(path) => toggle(path)}
        />
      )}
    </Box>
  );
};

export { SpriteGrid };
