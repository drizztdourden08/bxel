/* @layer renderer-app @kind test */
import { fake } from './app-tools-fake';

const fakeSource = () => ({
  get: (key: string) => fake.sourceStore.get(key),
  set: (key: string, value: unknown) => {
    if (!fake.fails.has(key)) fake.sourceStore.set(key, value);
    return undefined;
  },
  flush: () => Promise.resolve(),
  subscribe: () => () => undefined,
});

export { fakeSource };
