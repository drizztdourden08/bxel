/* @layer renderer-app @kind types */
import type { AssetKey, AssetKind } from '@bxel/document';
import type { AssetFocus } from '../asset-config/asset-config.type';
import type { DocumentView } from '../documents/document-host.type';
import type { OpenTab, Workspace } from '../workspace/workspace.type';

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

type FileSummaryData = {
  readonly name: string;
  readonly size: number;
  readonly modified: number;
  readonly isImage: boolean;
  readonly width: number | null;
  readonly height: number | null;
  readonly frames: number | null;
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
  past: readonly SubjectRef[];
  future: readonly SubjectRef[];
  pinTo: (ref: SubjectRef, route?: string) => void;
  unpin: () => void;
  back: () => void;
  forward: () => void;
}

export type { FileSummaryData, Subject, SubjectInputs, SubjectRef, SubjectState, SubjectStoreState };
