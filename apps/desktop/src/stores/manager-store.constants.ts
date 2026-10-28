/* @layer renderer-app @kind constants */
import { NO_FILTER, ZOOM } from '../sheet-manager/manager.constants';
import type { ManagerSettings } from './manager-store.type';

const MANAGER_DEFAULTS: ManagerSettings = {
  view: 'grid',
  zoom: ZOOM.start,
  query: '',
  filter: NO_FILTER,
  sortKey: 'manual',
  sortDown: false,
  dialog: null,
  picked: [],
  layoutOpen: false,
  showExport: false,
  libraryRequest: 0,
  atlas: { extrude: 0, trim: false, powerOfTwo: false, rotate: false, pageSide: 0, page: 0 },
  collapsed: [],
  selections: [],
};

export { MANAGER_DEFAULTS };
