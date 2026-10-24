/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { DEFAULT_PREFIX } from './AppControl.constants';
import { AppDefaultRow } from './sub-components/AppDefaultRow';

const AppControl = ({ field }: { field: string }) =>
  field.startsWith(DEFAULT_PREFIX) ? <AppDefaultRow field={field.slice(DEFAULT_PREFIX.length) as keyof AssetDefaults} /> : null;

export { AppControl };
