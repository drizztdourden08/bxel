/* @layer renderer-app @kind component */
import { Box, Button, DropdownMenu, Flex, Icon, Tooltip } from '@drizztdourden08/tessera';
import { ACCESS_LABEL } from '../../../project/project.constants';
import { newMenuGroups } from '../behavior/new-menu-groups';
import { optionsMenuGroups } from '../behavior/options-menu-groups';
import { projectMenuGroups } from '../behavior/project-menu-groups';
import { PANEL_UI } from '../ProjectPanel.constants';
import type { PanelPartProps } from '../ProjectPanel.type';
import './ProjectHeader.css';

const ProjectHeader = ({ model }: PanelPartProps) => {
  const { project } = model;
  if (project === null) return null;
  const access = project.manifest.assistant.access;
  const level = PANEL_UI.assistantLabel(ACCESS_LABEL[access]);
  return (
    <Flex align="center" gap="xs" className="project-header">
      <Box className="project-header__name">
        <DropdownMenu
          size="xs"
          variant="ghost"
          label={PANEL_UI.menuLabel}
          trigger={{ label: project.manifest.name, icon: 'folder-open' }}
          groups={projectMenuGroups(model)}
        />
      </Box>
      <Tooltip content={level}>
        <Icon name="plug-zap" label={level} size={14} className="project-header__assistant" data-on={access !== 'off'} />
      </Tooltip>
      <Flex gap="2xs" data-project-new>
        <Button size="xs" variant="secondary" icon={<Icon name="plus" />} onClick={() => model.rowActions.newAsset('sprite')}>
          {PANEL_UI.newLabel}
        </Button>
        <DropdownMenu
          size="xs"
          variant="secondary"
          align="end"
          label={PANEL_UI.newMenuLabel}
          trigger={{ label: PANEL_UI.newMenuLabel, icon: 'chevron-down', iconOnly: true }}
          groups={newMenuGroups(model)}
        />
      </Flex>
      <DropdownMenu
        size="xs"
        variant="ghost"
        align="end"
        label={PANEL_UI.optionsLabel}
        trigger={{ label: PANEL_UI.optionsLabel, icon: 'ellipsis', iconOnly: true }}
        groups={optionsMenuGroups(model)}
      />
    </Flex>
  );
};

export { ProjectHeader };
