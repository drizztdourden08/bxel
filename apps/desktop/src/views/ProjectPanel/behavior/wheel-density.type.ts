/* @layer renderer-app @kind types */
import type { ProjectViewSettings } from '../../../panel-browser/browser-state.type';

type Look = Pick<ProjectViewSettings, 'density' | 'tile'>;

export type { Look };
