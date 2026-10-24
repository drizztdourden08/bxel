/* @layer renderer-app @kind logic */
import type { ConfigSource, PendingEdit, SourceDriver } from './config-source.type';

const createConfigSource = <C>(driver: SourceDriver<C>): ConfigSource => {
  const listeners = new Set<() => void>();
  const pending = new Map<string, PendingEdit<C>>();
  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  const commit = async (key: string, context: C, value: unknown): Promise<void> => {
    pending.delete(key);
    const error = await driver.fields[key]?.write?.(context, value);
    if (typeof error === 'string') driver.report(error);
    notify();
  };

  const later = (key: string, context: C, value: unknown): void => {
    const earlier = pending.get(key);
    if (earlier) clearTimeout(earlier.timer);
    pending.set(key, { context, value, timer: setTimeout(() => void commit(key, context, value), driver.delayMs) });
    notify();
  };

  const flush = async (): Promise<void> => {
    const open = [...pending];
    for (const [key, edit] of open) {
      clearTimeout(edit.timer);
      await commit(key, edit.context, edit.value);
    }
  };

  return {
    get: (key) => {
      const edit = pending.get(key);
      const context = driver.context();
      const field = driver.fields[key];
      if (edit) return edit.value;
      return context !== null && field ? field.read(context) : undefined;
    },
    set: (key, value) => {
      const context = driver.context();
      const field = driver.fields[key];
      if (context === null || !field?.write || driver.locked(context)) return undefined;
      if (field.buffered) return later(key, context, value);
      return commit(key, context, value);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      const stop = driver.watch(notify);
      return () => {
        listeners.delete(listener);
        stop();
      };
    },
    flush,
  };
};

export { createConfigSource };
