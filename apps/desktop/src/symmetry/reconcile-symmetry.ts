/* @layer renderer-app @kind logic */
import { currentTarget } from '../editor/current-target';
import { loadSymmetry } from './load-symmetry';
import { NO_SYMMETRY } from './no-symmetry.constants';
import { saveSymmetry } from './save-symmetry';
import { storeSymmetry } from './store-symmetry';
import { symmetryKey } from './symmetry-key';

const seen: { sprite: string | null; doc: string; store: string } = { sprite: null, doc: '', store: '' };

const remember = (): void => {
  const target = currentTarget();
  if (!target) return;
  seen.sprite = target.sprite.id;
  seen.doc = symmetryKey(target.sprite.symmetry ?? NO_SYMMETRY);
  seen.store = symmetryKey(storeSymmetry());
};

const reconcileSymmetry = (): void => {
  const target = currentTarget();
  if (!target) return;
  const doc = symmetryKey(target.sprite.symmetry ?? NO_SYMMETRY);
  const store = symmetryKey(storeSymmetry());
  const documentMoved = seen.sprite !== target.sprite.id || seen.doc !== doc;
  if (documentMoved && doc !== store) loadSymmetry(target.sprite.symmetry ?? NO_SYMMETRY);
  else if (!documentMoved && seen.store !== store && doc !== store) saveSymmetry(target);
  remember();
};

export { reconcileSymmetry };
