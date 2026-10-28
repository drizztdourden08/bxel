/* @layer renderer-app @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera';
import type { MouseEvent } from 'react';
import { PANEL_UI } from '../../../ProjectPanel.constants';
import type { RowPartProps } from '../ProjectTree.type';

const RowMore = ({ item, model }: RowPartProps) => {
  const open = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    const box = event.currentTarget.getBoundingClientRect();
    model.rowActions.showMenu(item.key, { x: box.left, y: box.bottom });
  };
  return (
    <IconButton label={PANEL_UI.actions(item.name)} size="xs" variant="ghost" tabIndex={-1} aria-hidden className="project-row__more" onClick={open}>
      <Icon name="ellipsis" />
    </IconButton>
  );
};

export { RowMore };
