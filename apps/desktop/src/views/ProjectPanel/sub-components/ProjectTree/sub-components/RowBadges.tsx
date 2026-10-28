/* @layer renderer-app @kind component */
import { Badge, Box, Icon, Tooltip } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import { BADGE_ICON, PANEL_UI } from '../../../ProjectPanel.constants';
import type { RowPartProps } from '../ProjectTree.type';
import './RowBadges.css';

const usersText = (count: number): string => (count === 1 ? 'Used by 1 asset. Click to show it.' : `Used by ${count} assets. Click to show them.`);

const missingText = (names: readonly string[]): string => `Missing: ${names.join(', ')}`;

const RowBadges = ({ item, status, model }: RowPartProps) => {
  const folderLike = item.kind === 'folder' || item.role === 'group';
  const unsaved = folderLike ? status.unsavedBelow > 0 : status.unsaved;
  const missing = folderLike ? status.missingBelow > 0 : status.missing.length > 0;
  return (
    <Box className="project-badges">
      {item.readOnly ? (
        <Tooltip content={PANEL_UI.readOnly}>
          <Icon name={BADGE_ICON.readOnly} label={PANEL_UI.readOnly} size={12} />
        </Tooltip>
      ) : null}
      {missing ? (
        <Tooltip content={folderLike ? `${status.missingBelow} with missing links` : missingText(status.missing)}>
          <Icon name={BADGE_ICON.missing} label={folderLike ? 'Missing links inside' : missingText(status.missing)} size={12} className="project-badges__missing" />
        </Tooltip>
      ) : null}
      {unsaved ? <Badge variant="dot" color="warning" label={ASSET_LIST_TEXT.unsaved} /> : null}
      {status.open && !folderLike ? (
        <Tooltip content="Open in a tab">
          <Icon name={BADGE_ICON.open} label="Open in a tab" size={10} className="project-badges__open" />
        </Tooltip>
      ) : null}
      {status.usedBy > 0 && !folderLike ? (
        <Box className="project-badges__users" onClick={(event) => { event.stopPropagation(); model.query.setUsedBy(item.name); }}>
          <Tooltip content={usersText(status.usedBy)}>
            <Badge variant="inline" color="tame" value={status.usedBy} label={usersText(status.usedBy)} />
          </Tooltip>
        </Box>
      ) : null}
    </Box>
  );
};

export { RowBadges };
