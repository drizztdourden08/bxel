/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { DEFAULT_PREFIX } from './ProjectControl.constants';
import type { ProjectControlProps } from './ProjectControl.type';
import { AccessControl } from './sub-components/AccessControl';
import { AssistantFolders } from './sub-components/AssistantFolders';
import { CoverControl } from './sub-components/CoverControl';
import { DefaultRow } from './sub-components/DefaultRow';
import { FoldersControl } from './sub-components/FoldersControl';
import { PalettesControl } from './sub-components/PalettesControl';

const ProjectControl = ({ field }: ProjectControlProps) => {
  switch (field) {
    case 'project.cover':
      return <CoverControl />;
    case 'project.folders':
      return <FoldersControl />;
    case 'project.palettes':
      return <PalettesControl />;
    case 'project.access':
      return <AccessControl />;
    case 'project.assistantFolders':
      return <AssistantFolders />;
    default:
      return field.startsWith(DEFAULT_PREFIX) ? <DefaultRow field={field.slice(DEFAULT_PREFIX.length) as keyof AssetDefaults} /> : null;
  }
};

export { ProjectControl };
