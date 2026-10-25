/* @layer renderer-app @kind component */
import type { AssetDefaults } from '@bxel/project';
import { CanvasPreview } from '../CanvasPreview';
import { SurroundEditor } from '../SurroundEditor';
import { CANVAS_FIELDS, DEFAULT_PREFIX } from './AppControl.constants';
import { AppDefaultRow } from './sub-components/AppDefaultRow';

const AppControl = ({ field }: { field: string }) => {
  switch (field) {
    case CANVAS_FIELDS.backgroundPreview:
      return <CanvasPreview kind="background" />;
    case CANVAS_FIELDS.gridPreview:
      return <CanvasPreview kind="grid" />;
    case CANVAS_FIELDS.surroundCustom:
      return <SurroundEditor />;
    default:
      return field.startsWith(DEFAULT_PREFIX) ? <AppDefaultRow field={field.slice(DEFAULT_PREFIX.length) as keyof AssetDefaults} /> : null;
  }
};

export { AppControl };
