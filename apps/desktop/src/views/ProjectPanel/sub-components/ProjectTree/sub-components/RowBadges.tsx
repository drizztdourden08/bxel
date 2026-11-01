/* @layer renderer-app @kind component */
import { Badge, Box, Button, Icon, Tooltip } from '@drizztdourden08/tessera';
import { ASSET_LIST_TEXT } from '../../../../../asset-list/asset-list-text.constants';
import { quoted } from '../../../../../panel-browser/quoted';
import { BADGE_ICON, PANEL_UI } from '../../../ProjectPanel.constants';
import { badgeMarks } from '../behavior/badge-marks';
import type { RowPartProps } from '../ProjectTree.type';
import './RowBadges.css';

const RowBadges = ({ item, status, model }: RowPartProps) => {
  const marks = badgeMarks(item, status);
  return (
    <Box className="project-badges">
      {marks.readOnly ? (
        <Tooltip content={PANEL_UI.readOnly}>
          <Icon name={BADGE_ICON.readOnly} label={PANEL_UI.readOnly} size={12} />
        </Tooltip>
      ) : null}
      {marks.legacy ? (
        <Tooltip content={PANEL_UI.legacySplit}>
          <Badge variant="inline" color="info" value={PANEL_UI.legacySplitMark} label={PANEL_UI.legacySplit} />
        </Tooltip>
      ) : null}
      {marks.missing === null ? null : (
        <Tooltip content={marks.missing}>
          <Icon name={BADGE_ICON.missing} label={marks.missing} size={12} className="project-badges__missing" />
        </Tooltip>
      )}
      {marks.unsaved ? <Badge variant="dot" color="warning" label={ASSET_LIST_TEXT.unsaved} /> : null}
      {marks.open ? (
        <Tooltip content="Open in a tab">
          <Icon name={BADGE_ICON.open} label="Open in a tab" size={10} className="project-badges__open" />
        </Tooltip>
      ) : null}
      {marks.usedBy > 0 && marks.users !== null ? (
        <Button
          variant="ghost"
          size="xs"
          className="project-badges__users"
          title={marks.users}
          aria-label={`${item.name}: ${marks.users}`}
          onClick={() => {
            model.search.setText('');
            model.search.toggle(`uses:${quoted(item.name)}`);
          }}
        >
          {marks.usedBy}
        </Button>
      ) : null}
    </Box>
  );
};

export { RowBadges };
