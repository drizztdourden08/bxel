/* @layer renderer-app @kind types */
import type { AssetKey } from '@bxel/document';

type Planned = { readonly key: AssetKey; readonly path: string };

type Blocked = { readonly key: AssetKey; readonly reason: string };

type Roots = { readonly keys: readonly AssetKey[]; readonly named?: readonly AssetKey[] };

type Plan = { readonly planned: readonly Planned[]; readonly blocked: readonly Blocked[] };

export type { Blocked, Plan, Planned, Roots };
