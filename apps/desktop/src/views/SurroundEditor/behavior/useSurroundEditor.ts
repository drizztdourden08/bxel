/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { BLANK_PATTERN } from '../../../canvas-look/canvas-look.constants';
import { cleanBits } from '../../../canvas-look/clean-bits';
import { invertBits } from '../../../canvas-look/invert-bits';
import { patternBits } from '../../../canvas-look/pattern-bits';
import { useCanvasLook } from '../../../canvas-look/useCanvasLook';
import type { AppSettings } from '../../../settings.type';
import type { SurroundModel } from '../SurroundEditor.type';

const useSurroundEditor = (): SurroundModel => {
  const { settings, patch } = useSettings<AppSettings>();
  const look = useCanvasLook();
  const bits = cleanBits(settings.surroundCustom);
  const setBits = (next: string) => patch({ surroundCustom: next, surroundPattern: 'custom' });
  return {
    look,
    kind: settings.surroundPattern,
    bits,
    setKind: (kind) => patch({ surroundPattern: kind }),
    setBits,
    clear: () => setBits(BLANK_PATTERN),
    invert: () => setBits(invertBits(bits)),
    copyChosen: () => setBits(patternBits(settings.surroundPattern, settings.surroundCustom)),
  };
};

export { useSurroundEditor };
