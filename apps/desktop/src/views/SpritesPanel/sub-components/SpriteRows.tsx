/* @layer renderer-app @kind component */
import { Box, useVirtualWindow } from '@drizztdourden08/tessera';
import { useCallback, useRef } from 'react';
import type { CSSProperties } from 'react';
import { rowPlace } from '../behavior/row-place';
import { ROW_COUNT_PROPERTY, ROW_INDEX_ATTRIBUTE } from '../SpritesPanel.constants';
import type { SpriteRowsProps } from '../SpritesPanel.type';

const SpriteRows = ({ items, rowOf }: SpriteRowsProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const keyAt = useCallback((index: number) => items[index]?.key, [items]);
  const slice = useVirtualWindow({ enabled: true, count: items.length, keyAt, rootRef, indexAttribute: ROW_INDEX_ATTRIBUTE });
  const sized = { [ROW_COUNT_PROPERTY]: items.length } as CSSProperties;
  return (
    <Box ref={rootRef} role="presentation" className="sprites-panel__rowscroll" onScroll={slice.onScroll}>
      <Box ref={slice.bodyRef} role="rowgroup" className="sprites-panel__rows" style={sized} onFocus={slice.onFocus} onBlur={slice.onBlur}>
        {slice.indices.map((at) => {
          const item = items[at];
          return item ? rowOf(item, rowPlace(at)) : null;
        })}
      </Box>
    </Box>
  );
};

export { SpriteRows };
