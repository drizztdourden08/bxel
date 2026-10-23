/* @layer renderer-app @kind test */
type Cleanup = void | (() => void);

interface Cell {
  value?: unknown;
  current?: unknown;
  deps?: readonly unknown[];
  effect?: () => Cleanup;
  cleanup?: Cleanup;
  callback?: (...args: never[]) => unknown;
  call?: (...args: never[]) => unknown;
}

interface Run {
  slots: unknown[];
  at: number;
  queued: (() => void)[];
  changed: boolean;
}

const run: Run = { slots: [], at: 0, queued: [], changed: false };

const hasChanged = (): boolean => run.changed;

const slot = <T>(make: () => T): T => {
  const index = run.at;
  run.at += 1;
  if (run.slots[index] === undefined) run.slots[index] = make();
  return run.slots[index] as T;
};

const sameDeps = (before: readonly unknown[] | undefined, after: readonly unknown[]): boolean =>
  before?.length === after.length && after.every((dep, i) => Object.is(dep, before[i]));

const useState = <T>(initial: T | (() => T)): [T, (next: T | ((value: T) => T)) => void] => {
  const cell = slot<{ value: T }>(() => ({ value: typeof initial === 'function' ? (initial as () => T)() : initial }));
  const set = (next: T | ((value: T) => T)) => {
    const value = typeof next === 'function' ? (next as (value: T) => T)(cell.value) : next;
    if (Object.is(value, cell.value)) return;
    cell.value = value;
    run.changed = true;
  };
  return [cell.value, set];
};

const useEffect = (effect: () => Cleanup, deps?: readonly unknown[]): void => {
  const cell = slot<Cell>(() => ({}));
  if (deps !== undefined && sameDeps(cell.deps, deps)) return;
  cell.deps = deps;
  cell.effect = effect;
  run.queued.push(() => {
    if (typeof cell.cleanup === 'function') cell.cleanup();
    cell.cleanup = effect();
  });
};

const hooks = {
  useState,
  useRef: <T>(initial: T) => slot<{ current: T }>(() => ({ current: initial })),
  useCallback: <T>(callback: T) => callback,
  useMemo: <T>(make: () => T) => make(),
  useEffect,
  useLayoutEffect: useEffect,
  useEffectEvent: <A extends unknown[], R>(callback: (...args: A) => R) => {
    const cell = slot<Cell>(() => ({}));
    cell.callback = callback;
    cell.call ??= (...args: never[]) => cell.callback?.(...args);
    return cell.call as (...args: A) => R;
  },
};

const cleanUp = (): void =>
  run.slots.forEach((cell) => {
    const entry = cell as Cell | undefined;
    if (typeof entry?.cleanup === 'function') entry.cleanup();
    if (entry?.effect) entry.cleanup = undefined;
  });

const setUp = (): void =>
  run.slots.forEach((cell) => {
    const entry = cell as Cell | undefined;
    if (entry?.effect) entry.cleanup = entry.effect();
  });

const mountHook = <T>(first: () => T) => {
  let render = first;
  let current: T;
  run.slots = [];
  run.queued = [];
  const draw = (): void => {
    do {
      run.changed = false;
      run.at = 0;
      current = render();
      const effects = run.queued;
      run.queued = [];
      effects.forEach((effect) => effect());
    } while (hasChanged());
  };
  draw();
  return {
    get current(): T {
      return current;
    },
    act: (press: (state: T) => void): void => {
      press(current);
      if (hasChanged()) draw();
    },
    rerender: (next: () => T): void => {
      render = next;
      draw();
    },
    unmount: cleanUp,
    strictRemount: (): void => {
      cleanUp();
      setUp();
    },
  };
};

export { hooks, mountHook };
