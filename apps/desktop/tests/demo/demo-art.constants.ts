/* @layer renderer-app @kind constants */
const DEMO_NAME = 'Bxel Demo';

const DEMO_PALETTE = 'Demo 16';

const DEMO_COLOURS = [
  { rgb: '#1b1b2f', name: 'Outline' },
  { rgb: '#f2c9a0', name: 'Skin' },
  { rgb: '#6b3e26', name: 'Hair' },
  { rgb: '#d64550', name: 'Shirt' },
  { rgb: '#9c2f3a', name: 'Shirt shadow' },
  { rgb: '#3a5ba0', name: 'Trousers' },
  { rgb: '#2a2a3a', name: 'Boots' },
  { rgb: '#5ec26a', name: 'Slime' },
  { rgb: '#3a8f4a', name: 'Slime shadow' },
  { rgb: '#b8f0b0', name: 'Slime light' },
  { rgb: '#6bbf59', name: 'Grass' },
  { rgb: '#3f8f3f', name: 'Grass shadow' },
  { rgb: '#9b6b3f', name: 'Dirt' },
  { rgb: '#4aa3df', name: 'Water' },
  { rgb: '#9fd8f5', name: 'Water light' },
] as const;

const SYMBOLS = '.oshrdbkgGlpqewv';

const SIDE = 16;

const TILE_SIDE = 8;

const HERO_FRAMES: readonly (readonly string[])[] = [
  ['', '.....oooooo', '....ohhhhhho', '....ohhhhhho', '....osksskso', '....osssssso', '.....oooooo', '...orrrrrrrro', '...orrddddrro', '...osrrrrrrso', '...ossbbbbsso', '....obbbbbbo', '...obbo.obbo', '...obbo.obbo', '...okko.okko', '...oooo.oooo'],
  ['', '', '.....oooooo', '....ohhhhhho', '....ohhhhhho', '....osksskso', '....osssssso', '...orrrrrrrro', '...orrddddrro', '...osrrrrrrso', '...ossbbbbsso', '....obbbbbbo', '....obbbbbo', '...obbo.obo', '...okko.oko', '...oooo.ooo'],
  ['', '', '.....oooooo', '....ohhhhhho', '....ohhhhhho', '....osksskso', '....osssssso', '...orrrrrrrro', '...orrddddrro', '...osrrrrrrso', '...ossbbbbsso', '....obbbbbbo', '....obbbbbo', '....obo.obbo', '....oko.okko', '....ooo.oooo'],
];

const SLIME_ROWS: readonly string[] = [
  '',
  '',
  '',
  '',
  '',
  '',
  '....oooooooo',
  '...oggllggggo',
  '..ogllllgggggo',
  '..oggggggggggo',
  '..ogkkggggkkgo',
  '..oggggggggggo',
  '..oGGGGGGGGGGo',
  '...ooGGGGGGoo',
  '....oooooooo',
];

const TILE_ROWS = {
  grass: ['pppppppp', 'pppqpppp', 'pppppppp', 'ppppppqp', 'pqpppppp', 'pppppppp', 'ppppqppp', 'pppppppp'],
  dirt: ['eeeeeeee', 'eeekeeee', 'eeeeeeee', 'eeeeeeke', 'ekeeeeee', 'eeeeeeee', 'eeeekeee', 'eeeeeeee'],
  water: ['wwwwwwww', 'wwvvwwww', 'wwwwwwww', 'wwwwwvvw', 'wvvwwwww', 'wwwwwwww', 'wwwwvvww', 'wwwwwwww'],
} as const;

const MAP_ROWS: readonly string[] = [
  '111111111111',
  '111112221111',
  '111122222111',
  '111222222211',
  '113322222221',
  '133332222221',
  '333333222111',
  '333333332111',
];

const FRAME_MS = [120, 180, 240] as const;

export { DEMO_COLOURS, DEMO_NAME, DEMO_PALETTE, FRAME_MS, HERO_FRAMES, MAP_ROWS, SIDE, SLIME_ROWS, SYMBOLS, TILE_ROWS, TILE_SIDE };
