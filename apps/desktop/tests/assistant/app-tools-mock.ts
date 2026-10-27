/* @layer renderer-app @kind test */
import { brockReactMock } from '../keymap/brock-react-mock';
import { fake } from './app-tools-fake';

const find = (id: string) => fake.commands.find((command) => command.id === id);

const brockMock = () => ({
  ...brockReactMock(),
  announce: (text: string) => fake.announced.push(text),
  commands: {
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
  },
  nav: {
    active: () => null,
    routes: () => fake.routes,
    open: (route: string) => fake.opened.push(route),
    close: () => {
      fake.closed += 1;
    },
  },
  dialogs: { current: () => null },
});

export { brockMock };
