/* @layer renderer-app @kind component */
import { Box, Button, Icon, IconButton } from '@drizztdourden08/tessera';
import type { MouseEvent } from 'react';
import { FILE_NEW_KEY } from '../../../../../panel-browser/project-browser.constants';
import { PANEL_UI } from '../../../ProjectPanel.constants';
import type { RowPartProps } from '../ProjectTree.type';
import './RowTrail.css';

const RowTrail = (props: RowPartProps) => {
  const { item, model } = props;
  if (item.key === FILE_NEW_KEY) return null;
  const open = (event: MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    const box = event.currentTarget.getBoundingClientRect();
    model.rowActions.showMenu(item.key, { x: box.left, y: box.bottom });
  };
  const grant = item.readOnly && item.role !== 'group';
  return (
    <Box className="project-trail">
      {grant ? (
        <Button variant="secondary" size="xs" onClick={() => model.grantFolder(item.key)}>
          {PANEL_UI.grant}
        </Button>
      ) : null}
      {item.role === 'group' ? null : (
        <IconButton label={PANEL_UI.actions(item.name)} size="xs" variant="ghost" className="project-trail__more" onClick={open}>
          <Icon name="ellipsis" />
        </IconButton>
      )}
    </Box>
  );
};

export { RowTrail };
