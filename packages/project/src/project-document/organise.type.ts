/* @layer core @kind types */
type OrganiseCollection = { readonly id: string; readonly name: string; readonly assets: readonly string[] };

type OrganiseSearch = { readonly id: string; readonly name: string; readonly query: string };

type OrganiseTags = Readonly<Record<string, readonly string[]>>;

type ProjectOrganise = {
  readonly tags: OrganiseTags;
  readonly collections: readonly OrganiseCollection[];
  readonly smart: readonly OrganiseSearch[];
  readonly pinned: readonly string[];
};

export type { OrganiseCollection, OrganiseSearch, OrganiseTags, ProjectOrganise };
