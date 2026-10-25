/* @layer renderer-app @kind test */
import { beforeEach } from 'vitest';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';

type Held = { rig: Rig };

const heldRig = (): Held => {
  const held: Held = { rig: rig() };
  beforeEach(() => {
    held.rig = rig();
  });
  return held;
};

export { heldRig };
