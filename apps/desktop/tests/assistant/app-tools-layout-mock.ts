/* @layer renderer-app @kind test */
import { fake } from './app-tools-fake';

const LIMITED = 3900;

const LIMIT_REASON = 'The widget is limited to 90% of the window.';

const note = (...parts: string[]): void => {
  fake.calls.push(parts.join(' '));
};

const widgetsMock = () => ({
  list: () => [{ id: 'timeline', label: 'Timeline', visible: true, placement: 'docked', side: 'bottom', size: 200, index: 0, tab: 0, rect: null, popped: false, context: 'default', available: true }],
  presets: () => ['Default'],
  open: (id: string) => note('open', id),
  close: (id: string) => note('close', id),
  toggle: (id: string) => note('toggle', id),
  popOut: (id: string) => note('popOut', id),
  focus: (id: string) => note('focus', id),
  dock: (id: string, options: unknown) => {
    note('dock', id, JSON.stringify(options));
    return { size: 300, reason: null };
  },
  float: (id: string, rect: unknown) => note('float', id, JSON.stringify(rect)),
  resize: (id: string, to: unknown) => {
    note('resize', id, JSON.stringify(to));
    return to === LIMITED ? { size: 1200, reason: LIMIT_REASON } : { size: typeof to === 'number' ? to : null, reason: null };
  },
  applyPreset: (name: string) => note('applyPreset', name),
  reset: () => note('resetWidgets'),
});

const toolbarsMock = () => ({
  list: () => [{ id: 'tools', label: 'Tools', shown: true, side: 'left', row: 0, index: 0, labels: false }],
  show: (id: string) => note('showToolbar', id),
  hide: (id: string) => note('hideToolbar', id),
  moveToSide: (id: string, side: string, row?: number) => note('toolbarSide', id, side, String(row)),
  labels: (id: string, on: boolean) => note('toolbarLabels', id, String(on)),
  reset: () => note('resetToolbars'),
});

const layoutMock = () => ({ widgets: widgetsMock(), toolbars: toolbarsMock() });

export { layoutMock, LIMIT_REASON, LIMITED };
