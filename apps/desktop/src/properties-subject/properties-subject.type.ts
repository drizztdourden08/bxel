/* @layer renderer-app @kind types */
import type { AssetKey, AssetKind } from '@bxel/document';
import type { AssetFocus } from '../asset-config/asset-config.type';
import type { DocumentView } from '../documents/document-host.type';
import type { OpenTab, Workspace } from '../workspace/workspace.type';

/** What a pin names: the file path when it has one, else the asset key inside the open document. */
type SubjectRef = { readonly path: string | null; readonly key: AssetKey | null };

type Subject = {
  readonly focus: AssetFocus;
  readonly kind: AssetKind;
  readonly name: string;
  readonly fileName: string;
  readonly path: string | null;
  readonly relativePath: string | null;
  readonly dirty: boolean;
  readonly hasTab: boolean;
  readonly pinned: boolean;
  readonly inProject: boolean;
};

type SubjectState =
  | { readonly status: 'none' }
  | { readonly status: 'missing'; readonly ref: SubjectRef }
  | { readonly status: 'ready'; readonly subject: Subject };

type SubjectInputs = {
  readonly pin: SubjectRef | null;
  readonly follow: OpenTab | null;
  readonly tabs: readonly OpenTab[];
  readonly workspaces: Readonly<Record<string, Workspace>>;
  readonly views: Readonly<Record<string, DocumentView>>;
};

interface SubjectStoreState {
  pin: SubjectRef | null;
  past: readonly SubjectRef[];
  future: readonly SubjectRef[];
  pinTo: (ref: SubjectRef) => void;
  unpin: () => void;
  back: () => void;
  forward: () => void;
  restore: (ref: SubjectRef | null) => void;
}

export type { Subject, SubjectInputs, SubjectRef, SubjectState, SubjectStoreState };
