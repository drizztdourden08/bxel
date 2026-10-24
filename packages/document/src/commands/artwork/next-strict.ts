/* @layer core @kind logic */

const nextStrict = (platformId: string | undefined, wanted: boolean | undefined): true | undefined =>
  platformId !== undefined && wanted === true ? true : undefined;

export { nextStrict };
