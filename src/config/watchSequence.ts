export const TOTAL_FRAMES = 240;
export const FRAME_WIDTH = 1920;
export const FRAME_HEIGHT = 1080;
export const FRAME_ASPECT_RATIO = FRAME_WIDTH / FRAME_HEIGHT;

export type ChapterId = 'hero' | 'rotation' | 'exploded';

export interface WatchChapter {
  id: ChapterId;
  roman: string;
  title: string;
  subtitle: string;
  startFrame: number;
  endFrame: number;
  targetProgress: number;
}

export interface ExplodedComponentSpec {
  id: string;
  indexLabel: string;
  name: string;
  material: string;
  detail: string;
  specBadge: string;
  xPercent: number;
  yPercent: number;
  revealProgress: number;
}

export interface SpecCategory {
  id: string;
  label: string;
  headline: string;
  summary: string;
  metrics: Array<{ label: string; value: string }>;
}

export function getFramePath(zeroBasedIndex: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(zeroBasedIndex)));
  const fileIndex = String(clamped + 1).padStart(3, '0');
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}frames/frame_${fileIndex}.webp`;
}

export const WATCH_CHAPTERS: WatchChapter[] = [
  {
    id: 'hero',
    roman: 'I',
    title: 'Surya Emergence',
    subtitle: 'Chiaroscuro Gold Dial Reveal',
    startFrame: 0,
    endFrame: 52,
    targetProgress: 0.09,
  },
  {
    id: 'rotation',
    roman: 'II',
    title: 'Royal Architecture',
    subtitle: '18K Rose Gold & Obsidian Ceramic',
    startFrame: 53,
    endFrame: 146,
    targetProgress: 0.39,
  },
  {
    id: 'exploded',
    roman: 'III',
    title: 'Calibre Deconstruction',
    subtitle: 'AU-8920 Openwork Filigree Movement',
    startFrame: 147,
    endFrame: 239,
    targetProgress: 0.87,
  },
];

export const EXPLODED_COMPONENTS: ExplodedComponentSpec[] = [
  {
    id: 'crystal',
    indexLabel: '01',
    name: 'Box-Domed Corundum Sapphire',
    material: 'Mohs 9 Hardness · Dual Anti-Reflective Film',
    detail:
      'Diamond-ground monocrystalline sapphire crystal offering optical clarity under harsh tropical sunlight, treated with 7-layer vapor deposition.',
    specBadge: 'Mohs 9 · 2.2 mm Profile',
    xPercent: 18,
    yPercent: 48,
    revealProgress: 0.67,
  },
  {
    id: 'bezel',
    indexLabel: '02',
    name: 'Octagonal Zirconia Ceramic Bezel',
    material: 'Micro-Blasted Jet Black Ceramic · 18K Gold Fasteners',
    detail:
      'Forged at 1,500 °C and torqued down by eight solid rose-gold hexagonal pins inspired by Rajput fort ramparts.',
    specBadge: '8 Gold Screws · ZrO₂',
    xPercent: 30,
    yPercent: 30,
    revealProgress: 0.72,
  },
  {
    id: 'calibre',
    indexLabel: '03',
    name: 'Openworked Calibre AU-8920',
    material: 'Hand-Relieved Bridges · Indian Jali Architecture',
    detail:
      'Geometric subtractive lattice bridges framing dual chronograph registers and an exposed 6 o’clock ruby balance escapement.',
    specBadge: '312 Parts · 37 Rubies',
    xPercent: 44,
    yPercent: 52,
    revealProgress: 0.78,
  },
  {
    id: 'geartrain',
    indexLabel: '04',
    name: 'Circular-Grained Brass Gear Train',
    material: 'Column-Wheel Chronograph & Twin Mainsprings',
    detail:
      'Precision wheels deliver steady torque at 28,800 vibrations per hour across an expansive 72-hour power reserve.',
    specBadge: '4 Hz · 72h Reserve',
    xPercent: 64,
    yPercent: 50,
    revealProgress: 0.84,
  },
  {
    id: 'caseback',
    indexLabel: '05',
    name: '18K 5N Solid Rose-Gold Caseback',
    material: 'Satin-Brushed Alloy · Numbered Edition of 50',
    detail:
      'Laser-inscribed with individual royal edition provenance and secured with triple fluorocarbon seals tested to 50 meters depth.',
    specBadge: '50 m · 18K 5N Gold',
    xPercent: 83,
    yPercent: 54,
    revealProgress: 0.9,
  },
];

export const SPECIFICATION_CATEGORIES: SpecCategory[] = [
  {
    id: 'movement',
    label: 'Movement & Calibre',
    headline: 'Manufacture Calibre AU-8920 Skeleton',
    summary:
      'Designed and hand-assembled in India by master watchmakers, regulated across five positions to chronometric precision.',
    metrics: [
      { label: 'Calibre Reference', value: 'AU-8920 In-House' },
      { label: 'Escapement Beat', value: '28,800 vph (4 Hz)' },
      { label: 'Power Autonomy', value: '72 Hours Twin-Barrel' },
      { label: 'Jewel Count', value: '37 Synthetic Rubies' },
      { label: 'Architecture', value: 'Jali Openwork Skeleton' },
      { label: 'Regulation', value: '5 Positions (±1.5 s/day)' },
    ],
  },
  {
    id: 'case',
    label: 'Case & Monocoque',
    headline: 'Faceted 18K 5N Rose Gold & Ceramic',
    summary:
      'Sculpted with sharp mirror-beveled lugs and matte ceramic shock-buffers, evoking royal palace geometries.',
    metrics: [
      { label: 'Diameter', value: '42.0 mm' },
      { label: 'Height / Thickness', value: '11.8 mm' },
      { label: 'Case Material', value: '18K 5N Solid Rose Gold' },
      { label: 'Bezel Ring', value: 'Micro-Blasted Black Ceramic' },
      { label: 'Crystal', value: 'Box Sapphire · Dual AR' },
      { label: 'Water Depth', value: '5 ATM (50 Meters)' },
    ],
  },
  {
    id: 'dial',
    label: 'Dial & Horology Strap',
    headline: 'Architectural Lattice & Saddle Leather',
    summary:
      'Applied 18K gold Roman indices with Super-LumiNova luminescence on vegetable-tanned full-grain leather.',
    metrics: [
      { label: 'Dial Index', value: 'Applied 18K Roman XII' },
      { label: 'Chronograph', value: 'Twin 30-Min & 60-Sec' },
      { label: 'Luminous Treatment', value: 'Super-LumiNova Old Radium' },
      { label: 'Hands', value: 'Diamond-Cut Skeleton Batons' },
      { label: 'Strap', value: 'Hand-Stitched Saddle Alligator' },
      { label: 'Deployant Clasp', value: '18K Rose-Gold Folding Buckle' },
    ],
  },
];
