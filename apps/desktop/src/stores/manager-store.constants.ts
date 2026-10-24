/* @layer renderer-app @kind constants */
import { NO_FILTER, ZOOM } from '../sheet-manager/manager.constants';
import type { ManagerSettings } from './manager-store.type';

const MANAGER_DEFAULTS: ManagerSettings = {
  tab: 'sprites',
  view: 'grid',
  zoom: ZOOM.start,
  query: '',
  filter: NO_FILTER,
  sortKey: 'manual',
  sortDown: false,
  sheetId: null,
  dialog: null,
  atlas: { extrude: 0, pivots: true, bounds: false, zoom: 2 },
};

export { MANAGER_DEFAULTS };
