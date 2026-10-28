/* @layer renderer-app @kind component */
import { Badge, Box, Icon, Image, Text } from '@drizztdourden08/tessera';
import type { MouseEvent } from 'react';
import { useThumb } from '../../../../../asset-thumbs/useThumb';
import { EMPTY_STATUS, ITEM_ICON } from '../../../../../panel-browser/project-browser.constants';
import { rowLabel } from '../../../../../panel-browser/row-label';
import { ITEM_ATTRIBUTE } from '../../../ProjectPanel.constants';
import type { GridTileProps } from '../ProjectGrid.type';
import './GridTile.css';

const GridTile = ({ model, item, cell }: GridTileProps) => {
  const { selection, rowActions, drag, data } = model;
  const status = data.statuses.get(item.key) ?? EMPTY_STATUS;
  const url = useThumb(item);
  const icon = <Icon name={ITEM_ICON[item.kind]} />;
  const click = (event: MouseEvent<HTMLElement>): void =>
    rowActions.pick(item, { shift: event.shiftKey, toggle: event.ctrlKey || event.metaKey, detail: event.detail });
  return (
    <Box
      {...cell}
      className={`${cell.className} project-tile`}
      aria-label={rowLabel(item, status, false)}
      aria-selected={selection.keys.has(item.key)}
      data-active={status.active}
      data-ghost={item.role === 'ghost'}
      {...{ [ITEM_ATTRIBUTE]: item.key }}
      onClick={click}
      onDoubleClick={() => rowActions.open(item)}
      {...drag.dragOut(item)}
    >
      <Box className="project-tile__thumb">{url === null ? icon : <Image className="project-tile__img" src={url} alt="" fit="contain" pixelated fallback={icon} />}</Box>
      <Text variant="caption" className="project-tile__name">
        {item.name}
      </Text>
      <Box className="project-tile__marks">
        {status.unsaved ? <Badge variant="dot" color="warning" label="Unsaved changes" /> : null}
        {status.missing.length > 0 ? <Icon name="triangle-alert" size={12} label={`Missing: ${status.missing.join(', ')}`} className="project-tile__missing" /> : null}
      </Box>
    </Box>
  );
};

export { GridTile };
