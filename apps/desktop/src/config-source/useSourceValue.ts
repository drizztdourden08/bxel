/* @layer renderer-app @kind hook */
import { useCallback, useSyncExternalStore } from 'react';
import type { ConfigSource } from './config-source.type';

const useSourceValue = (source: ConfigSource, key: string): unknown => {
  const subscribe = useCallback((listener: () => void) => source.subscribe?.(listener) ?? (() => undefined), [source]);
  const snapshot = useCallback(() => source.get(key), [source, key]);
  return useSyncExternalStore(subscribe, snapshot);
};

export { useSourceValue };
