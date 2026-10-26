/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { SurroundEditor } from '../SurroundEditor';
import { CANVAS_FIELDS, DEFAULT_PREFIX } from './AppControl.constants';
import { AppDefaultRow } from './sub-components/AppDefaultRow';

const AppControl = ({ field }: { field: string }) => {
  if (field === CANVAS_FIELDS.surroundCustom) return <SurroundEditor />;
  return field.startsWith(DEFAULT_PREFIX) ? <AppDefaultRow field={field.slice(DEFAULT_PREFIX.length) as keyof AssetDefaults} /> : null;
};

export { AppControl };
