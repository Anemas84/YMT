export interface JourneyStation {
  id: string;
  rank: number;
  city: string;
  region: string;
  title: string;
  rankName: string;
  flavor: string;
  requiredPrizes: number;
  // Art-directed positions on the desktop level-select board.
  x: number;
  y: number;
}

export const TOKAIDO_STATIONS: JourneyStation[] = [
  {
    id: 'fukuoka',
    rank: 1,
    city: 'FUKUOKA',
    region: 'KYUSHU',
    title: 'KYUSHU GATE',
    rankName: 'NOVICE',
    flavor: 'First coin. First stamp. The southern port where every arcade pilgrim begins.',
    requiredPrizes: 0,
    x: 13,
    y: 81,
  },
  {
    id: 'hiroshima',
    rank: 2,
    city: 'HIROSHIMA',
    region: 'CHUGOKU',
    title: 'INLAND SEA',
    rankName: 'INITIATE',
    flavor: 'Cross the Seto Inland Sea. One prize redeemed unlocks the western road.',
    requiredPrizes: 1,
    x: 25,
    y: 67,
  },
  {
    id: 'osaka',
    rank: 3,
    city: 'OSAKA',
    region: 'KANSAI',
    title: 'MERCHANT ARCADE',
    rankName: 'APPRENTICE',
    flavor: 'The merchant capital of prizes. Cabinets never sleep in Dotonbori neon.',
    requiredPrizes: 2,
    x: 36,
    y: 76,
  },
  {
    id: 'kyoto',
    rank: 4,
    city: 'KYOTO',
    region: 'KANSAI',
    title: 'IMPERIAL TEMPLE',
    rankName: 'ADEPT',
    flavor: 'Temple bells and ticket stubs. Rank is earned in the old capital.',
    requiredPrizes: 3,
    x: 45,
    y: 56,
  },
  {
    id: 'nagoya',
    rank: 5,
    city: 'NAGOYA',
    region: 'CHUBU',
    title: 'CASTLE KEEP',
    rankName: 'VETERAN',
    flavor: 'The castle keep of the Tokaido. Five prizes mark a true veteran.',
    requiredPrizes: 5,
    x: 54,
    y: 66,
  },
  {
    id: 'fuji',
    rank: 6,
    city: 'MOUNT FUJI',
    region: 'CHUBU',
    title: 'SACRED PEAK',
    rankName: 'ELITE',
    flavor: 'The YAMATO crest. Torii, red sun, and the sacred mountain itself.',
    requiredPrizes: 7,
    x: 63,
    y: 47,
  },
  {
    id: 'tokyo',
    rank: 7,
    city: 'TOKYO',
    region: 'KANTO',
    title: 'NEON CAPITAL',
    rankName: 'MASTER',
    flavor: 'Akihabara to Shibuya. Ten prizes crown a master of the capital.',
    requiredPrizes: 10,
    x: 73,
    y: 57,
  },
  {
    id: 'sendai',
    rank: 8,
    city: 'SENDAI',
    region: 'TOHOKU',
    title: 'NORTHERN GATE',
    rankName: 'GRAND MASTER',
    flavor: 'Beyond the capital, the northern gate. Fourteen prizes. Few pass.',
    requiredPrizes: 14,
    x: 79,
    y: 34,
  },
  {
    id: 'sapporo',
    rank: 9,
    city: 'SAPPORO',
    region: 'HOKKAIDO',
    title: 'FRONTIER STAR',
    rankName: 'LEGEND',
    flavor: 'The last station. Twenty prizes. The frontier star of Hokkaido.',
    requiredPrizes: 20,
    x: 88,
    y: 17,
  },
];

export function getCurrentStation(prizeCount: number): JourneyStation {
  let current = TOKAIDO_STATIONS[0];
  for (const station of TOKAIDO_STATIONS) {
    if (prizeCount >= station.requiredPrizes) {
      current = station;
    }
  }
  return current;
}

export function getNextStation(prizeCount: number): JourneyStation | null {
  const current = getCurrentStation(prizeCount);
  const idx = TOKAIDO_STATIONS.findIndex((s) => s.id === current.id);
  return TOKAIDO_STATIONS[idx + 1] ?? null;
}
