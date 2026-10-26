/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { heldRig } from './held-rig';
import type { Held } from './held-rig';
import { openSampleProject } from './open-sample-project';

type HeldProject = { readonly held: Held; readonly open: (artwork?: Artwork) => ReturnType<typeof openSampleProject> };

const heldProject = (): HeldProject => {
  const held = heldRig();
  return { held, open: (artwork) => openSampleProject(held.rig, artwork) };
};

export { heldProject };
export type { HeldProject };
