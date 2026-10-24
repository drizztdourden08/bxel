/* @layer renderer-app @kind logic */
import { afterAll, beforeAll } from 'vitest';
import type { Session } from './e2e.type';

const useRig = <Rig extends { readonly session: Session }>(open: () => Promise<Rig>): (() => Rig) => {
  const held: { rig?: Rig } = {};
  beforeAll(async () => {
    held.rig = await open();
  });
  afterAll(async () => {
    await held.rig?.session.close();
  });
  return () => {
    if (!held.rig) throw new Error('the app did not launch');
    return held.rig;
  };
};

export { useRig };
