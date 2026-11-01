/* @layer renderer-app @kind config */
import { widgets } from '@drizztdourden08/brock-react';
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'General', icon: 'settings', order: 1 };

const windowModes = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen without a frame, and other windows can still go on top.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the display until you leave fullscreen.' },
];

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      {
        key: 'windowMode',
        label: 'Window mode',
        description: 'Windowed, borderless or fullscreen.',
        hint: 'Pick how the window sits on the screen. It changes right away.',
        control: { kind: 'choice', options: windowModes },
      },
      {
        key: 'startFullscreen',
        label: 'Start fullscreen',
        description: 'Open in fullscreen on launch.',
        hint: 'On, the app opens fullscreen the next time it starts. The window you have now stays as it is.',
      },
      {
        key: 'workspacePerFileType',
        label: 'Remember the layout for each file type',
        description: 'Each kind of file keeps the widget layout you arranged for it.',
        hint: 'On, an animation you arranged once returns on the next animation tab, and a sprite keeps its own. Off, every file shares one layout. Window, Widgets, Workspace lists them and resets one.',
      },
      {
        key: 'widgetLayout',
        label: 'Widget layout',
        description: 'Put the widgets back where they start.',
        hint: 'Closes the widgets you opened and docks the others where the app first placed them.',
        actions: [{ id: 'reset-layout', label: 'Reset', icon: 'rotate-ccw', tone: 'danger', confirm: 'Reset the layout?', onSelect: () => widgets.reset() }],
      },
    ],
  },
  {
    id: 'project',
    title: 'Project panel',
    items: [
      {
        key: 'projectOpenOnClick',
        label: 'Open assets with one click',
        description: 'A single click in the Project panel opens an asset.',
        hint: 'Off, a click selects a row and a double click or Enter opens it. On, a click opens an asset at once and Ctrl or Shift with a click still selects.',
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    items: [
      {
        key: 'developerToolsEnabled',
        label: 'Developer tools',
        description: 'Allow opening the developer tools.',
        hint: 'On, the menu shows the developer entries and the shortcut opens the browser developer tools.',
      },
      {
        key: 'allowDebugLogging',
        label: 'Debug logging',
        description: 'Write debug lines to the session log.',
        hint: 'On, the session log keeps the detailed lines that help when you report a bug. The log grows faster.',
      },
    ],
  },
];

export default sections;
export { meta };
