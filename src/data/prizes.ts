export interface PrizeCardSpec {
  id: string;
  slotIndex: number;
  title: string;
  badge?: string;
  subtitleLeft: string;
  subtitleRight: string;
  image: string;
  seriesName: string;
  cost: number;
  rarityColor: string;
  description: string;
  serialCode: string;
}

export interface RedeemedItem {
  uid: string;
  prize: PrizeCardSpec;
  redeemedAt: string;
  bayId: number;
  rowId: number;
  pointsSpent: number;
}

export interface TelemetryLog {
  id: string;
  delta: number;
  label: string;
  timeAgo: string;
}

export const BASE_PRIZE_TEMPLATES: Omit<PrizeCardSpec, 'id' | 'slotIndex'>[] = [
  {
    title: 'WINGS OF FORIN',
    badge: '05',
    subtitleLeft: 'PLATINUM TIER',
    subtitleRight: 'TIER',
    image: '/images/card-wings.png',
    seriesName: 'WINGS OF FORIN [PLATINUM SERIES]',
    cost: 1250,
    rarityColor: '#a855f7',
    description:
      'Gothic Royal Edition vinyl plush figure adorned with antique bronze wings and deep amethyst fur.',
    serialCode: 'YMT-WF-05P',
  },
  {
    title: 'HAPPY HALLOWEEN',
    badge: '05',
    subtitleLeft: 'PUMPKIN TIER',
    subtitleRight: 'TIER',
    image: '/images/card-halloween.png',
    seriesName: 'HAPPY HALLOWEEN [PUMPKIN SERIES]',
    cost: 1250,
    rarityColor: '#f97316',
    description:
      'Festival Night Edition vinyl plush encased in a carved glowing Jack-O-Lantern pumpkin shell.',
    serialCode: 'YMT-HH-05K',
  },
  {
    title: 'LABUBU FOREST',
    badge: '05',
    subtitleLeft: 'FAIRY TALE',
    subtitleRight: 'TIER',
    image: '/images/card-forest.png',
    seriesName: 'LABUBU FOREST [FAIRY TALE SERIES]',
    cost: 1250,
    rarityColor: '#38bdf8',
    description:
      'Sakura Breeze Edition in cloud-white fleece wearing an orange forest duckbill cape.',
    serialCode: 'YMT-LF-05F',
  },
  {
    title: 'LABUBU WACKY WALT',
    badge: undefined,
    subtitleLeft: 'MART SERIES',
    subtitleRight: '1TIER 50',
    image: '/images/card-wacky.png',
    seriesName: 'WACKY MART [LIMITED SERIES]',
    cost: 1250,
    rarityColor: '#fb7185',
    description:
      'Collector blister-box edition from the Urban Wacky Mart Series with authentic red script plaque.',
    serialCode: 'YMT-WM-1T50',
  },
];

// Each shelf row has 8 cards: left group of 4 + right group of 4
export function getShelfRowCards(bayNumber: number, rowNumber: number): PrizeCardSpec[] {
  const templates = [...BASE_PRIZE_TEMPLATES, ...BASE_PRIZE_TEMPLATES];
  return templates.map((tpl, index) => ({
    ...tpl,
    id: `bay-${bayNumber}-row-${rowNumber}-slot-${index + 1}`,
    slotIndex: index + 1,
  }));
}

// Synthesized Arcade Audio Effects (Web Audio API)
class ArcadeSoundEngine {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playHover() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1480, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.065);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  playYamatoButton() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Classic Japanese arcade coin chime (two-tone high metallic ring)
    [987.77, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.075);
      gain.gain.setValueAtTime(0.12, now + i * 0.075);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.075 + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.075);
      osc.stop(now + i * 0.075 + 0.3);
    });
  }

  playRedeemFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.065);
      gain.gain.setValueAtTime(0.11, now + idx * 0.065);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.065 + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.065);
      osc.stop(now + idx * 0.065 + 0.34);
    });
  }
}

export const arcadeSound = new ArcadeSoundEngine();
