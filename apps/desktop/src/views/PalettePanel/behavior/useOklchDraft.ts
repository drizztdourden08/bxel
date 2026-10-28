/* @layer renderer-app @kind hook */
import { hexToOklch, oklchToHex } from '@bxel/palette';
import type { Oklch } from '@bxel/palette';
import { useCallback, useState } from 'react';

const useOklchDraft = (value: string, onChange: (hex: string) => void): [Oklch, (channel: keyof Oklch, next: number) => void] => {
  const [draft, setDraft] = useState<Oklch>(() => hexToOklch(value) ?? { l: 0, c: 0, h: 0 });
  const shown = oklchToHex(draft) === value.toLowerCase().slice(0, 7) ? draft : (hexToOklch(value) ?? draft);
  const change = useCallback(
    (channel: keyof Oklch, next: number) => {
      const colour = { ...shown, [channel]: next };
      setDraft(colour);
      onChange(oklchToHex(colour));
    },
    [shown, onChange],
  );
  return [shown, change];
};

export { useOklchDraft };
