/* @layer renderer-app @kind component */
import { Box, DropdownMenu, Flex, SearchInput } from '@drizztdourden08/tessera';
import type { KeyboardEvent } from 'react';
import { filterMenuGroups } from '../behavior/filter-menu-groups';
import { PANEL_UI } from '../ProjectPanel.constants';
import type { PanelPartProps } from '../ProjectPanel.type';
import './ProjectSearch.css';

const ProjectSearch = ({ model }: PanelPartProps) => {
  const { query } = model;
  const escape = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    if (query.search !== '') query.setSearch('');
    else document.querySelector<HTMLElement>('[role="tree"] [tabindex="0"]')?.focus();
  };
  return (
    <Flex align="center" gap="xs" data-project-search>
      <Box className="project-search__field">
        <SearchInput aria-label={PANEL_UI.searchLabel} placeholder={PANEL_UI.searchPlaceholder} value={query.search} onChange={query.setSearch} onKeyDown={escape} />
      </Box>
      <DropdownMenu
        size="xs"
        variant="ghost"
        align="end"
        label={PANEL_UI.filterLabel}
        trigger={{ label: PANEL_UI.filterLabel, icon: 'funnel', iconOnly: true }}
        groups={filterMenuGroups(model)}
      />
    </Flex>
  );
};

export { ProjectSearch };
