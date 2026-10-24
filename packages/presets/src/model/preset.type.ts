/* @layer core @kind types */
type RuleTier = 'enforce' | 'warn' | 'advisory';

type RuleName = 'bankSize' | 'bankCount' | 'slot0' | 'colour' | 'spriteSize' | 'area';

type RuleTiers = Readonly<Record<RuleName, RuleTier>>;

type Slot0Policy = 'transparent' | 'background' | 'colour';

type PresetKind = 'sprite' | 'tile' | 'bitmap' | 'any';

type SizePair = readonly [number, number];

type ChannelBits = readonly [number, number, number];

type BankSpec = {
  readonly count: number;
  readonly size: number;
  readonly slot0: Slot0Policy;
  readonly slot0Forced: boolean;
  readonly slot0Shared: boolean;
};

type ColourModel =
  | { readonly kind: 'channelBits'; readonly bits: ChannelBits }
  | { readonly kind: 'fixedSet'; readonly colours: readonly string[] }
  | { readonly kind: 'subset'; readonly bits: ChannelBits; readonly subset: number };

type SpriteSizeRule =
  | { readonly kind: 'any' }
  | { readonly kind: 'list'; readonly sizes: readonly SizePair[] }
  | { readonly kind: 'groups'; readonly groups: readonly (readonly SizePair[])[] }
  | {
      readonly kind: 'steps';
      readonly stepW: number;
      readonly stepH: number;
      readonly maxW: number;
      readonly maxH: number;
    };

type SizeSpec = {
  readonly tile: SizePair | null;
  readonly sprites: SpriteSizeRule;
  readonly canvasDefault: SizePair;
};

type AreaRule = {
  readonly width: number;
  readonly height: number;
  readonly scope: 'sprite' | 'tile' | 'any';
  readonly kind: 'onePalettePerArea' | 'maxColoursPerArea';
  readonly limit: number;
  readonly tier: 'warn' | 'advisory';
};

type PlatformPreset = {
  readonly id: string;
  readonly name: string;
  readonly family: string;
  readonly version: number;
  readonly kind: PresetKind;
  readonly banks: BankSpec;
  readonly colour: ColourModel;
  readonly startPalette: readonly string[] | null;
  readonly sizes: SizeSpec;
  readonly areaRules: readonly AreaRule[];
  readonly tiers: RuleTiers;
  readonly notes: readonly string[];
  readonly advisory: readonly string[];
};

type FlatPresetSpec = {
  readonly id: string;
  readonly size: number;
};

type PresetFamily = {
  readonly family: string;
  readonly presets: readonly PlatformPreset[];
};

export type {
  AreaRule,
  BankSpec,
  ChannelBits,
  ColourModel,
  FlatPresetSpec,
  PlatformPreset,
  PresetFamily,
  PresetKind,
  RuleName,
  RuleTier,
  RuleTiers,
  SizePair,
  SizeSpec,
  Slot0Policy,
  SpriteSizeRule,
};
