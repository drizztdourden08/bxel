/* @layer renderer-app @kind test */
import { brockReactMock } from '../keymap/brock-react-mock';
import { catalogMock } from './app-tools-catalog-mock';
import { fake } from './app-tools-fake';
import { layoutMock } from './app-tools-layout-mock';

const find = (id: string) => fake.commands.find((command) => command.id === id);

const commandsMock = () => ({
  list: () => fake.commands.map((command) => ({ id: command.id, label: command.label, group: 'Test' })),
  chords: () => ['Mod+K'],
  describe: (id: string) => {
    const found = find(id);
    return found ? { enabled: found.enabled !== false, reason: found.reason ?? null, checked: false } : { enabled: false, reason: 'unknown', checked: false };
  },
  run: (id: string, context: unknown) => {
    const found = find(id);
    if (!found) return Promise.resolve({ ok: false, why: 'unknown', reason: 'unknown' });
    if (found.enabled === false) return Promise.resolve({ ok: false, why: 'disabled', reason: found.reason ?? 'off' });
    found.ran = [...(found.ran ?? []), context];
    return Promise.resolve({ ok: true });
  },
});

const navMock = () => ({
  active: () => null,
  routes: () => fake.routes,
  open: (route: string) => fake.opened.push(route),
  close: () => {
    fake.closed += 1;
  },
});

const dialogsMock = () => ({
  current: () => fake.dialog,
  answer: (choice: string) => {
    const open = fake.dialog;
    if (open === null) return { ok: false, why: 'none', reason: 'No confirm dialog is open.' };
    if (!open.choices.includes(choice)) return { ok: false, why: 'unknown', reason: `"${choice}" is not one of: ${open.choices.join(', ')}.` };
    fake.calls.push(`answer ${choice}`);
    return { ok: true, id: open.id, choice };
  },
});

const settingsMock = () => ({
  set: (key: string, value: unknown) => {
    fake.appSet.push([key, value]);
    return fake.fails.has(key) ? { ok: false, why: 'invalid', reason: 'The value is not valid.' } : { ok: true };
  },
});

const brockMock = () => ({
  ...brockReactMock(),
  ...layoutMock(),
  announce: (text: string) => fake.announced.push(text),
  commands: commandsMock(),
  nav: navMock(),
  dialogs: dialogsMock(),
  settings: settingsMock(),
  settingsCatalog: catalogMock,
});

export { brockMock };
