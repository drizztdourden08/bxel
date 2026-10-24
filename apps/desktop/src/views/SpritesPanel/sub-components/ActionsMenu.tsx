/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { ActionsMenuProps } from '../SpritesPanel.type';

const ActionsMenu = ({ groups }: ActionsMenuProps) => (
  <DropdownMenu size="sm" label={MANAGER_TEXT.actions} trigger={{ label: MANAGER_TEXT.moreActions, icon: 'ellipsis', iconOnly: true }} groups={groups} />
);

export { ActionsMenu };
