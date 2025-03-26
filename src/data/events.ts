import { Event, Fight, Fighter } from '../types/data';

// Interface for upcoming event placeholder
interface ComingSoonEvent {
  id: string;
  name: string;
  date: string;
  status: 'coming_soon';
  fights: number; // Number of fights expected
}

// Fighter Profiles
export const fighters: Record<string, Fighter> = {
  'brandon-moreno': {
    id: 'brandon-moreno',
    name: 'Brandon Moreno',
    record: '21-7-2',
    style: 'Brazilian Jiu-Jitsu',
    height: "5'7\"",
    weight: 125,
    weight_class: 'Flyweight',
    imageUrl: 'https://example.com/moreno.jpg',
    recentFights: [
      {
        date: '2024-01-20',
        opponent: 'B. Royval',
        result: 'W',
        method: 'S Dec',
        round: 5,
        time: '5:00',
        event: 'UFC 313: Moreno vs. Royval 2'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: -250 },
      { sportsbook: 'Caesars', value: -250 }
    ]
  },
  'steve-erceg': {
    id: 'steve-erceg',
    name: 'Steve Erceg',
    record: '11-1-0',
    style: 'Mixed Martial Artist',
    height: "5'8\"",
    weight: 125,
    weight_class: 'Flyweight',
    imageUrl: 'https://example.com/erceg.jpg',
    recentFights: [
      {
        date: '2024-02-17',
        opponent: 'M. Schnell',
        result: 'W',
        method: 'KO/TKO',
        round: 1,
        time: '4:15',
        event: 'UFC Fight Night: Lewis vs. Spivac'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: 195 },
      { sportsbook: 'Caesars', value: 190 }
    ]
  },
  'alexander-volkanovski': {
    id: 'alexander-volkanovski',
    name: 'Alexander Volkanovski',
    record: '26-4-0',
    style: 'Mixed Martial Artist',
    height: "5'6\"",
    weight: 145,
    weight_class: 'Featherweight',
    imageUrl: 'https://example.com/volkanovski.jpg',
    recentFights: [
      {
        date: '2024-01-20',
        opponent: 'I. Topuria',
        result: 'L',
        method: 'KO/TKO',
        round: 2,
        time: '3:49',
        event: 'UFC 313: Volkanovski vs. Topuria'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: -200 },
      { sportsbook: 'Caesars', value: -210 }
    ]
  },
  'diego-lopes': {
    id: 'diego-lopes',
    name: 'Diego Lopes',
    record: '23-6-0',
    style: 'Brazilian Jiu-Jitsu',
    height: "5'8\"",
    weight: 145,
    weight_class: 'Featherweight',
    imageUrl: 'https://example.com/lopes.jpg',
    recentFights: [
      {
        date: '2024-02-17',
        opponent: 'P. Sabatini',
        result: 'W',
        method: 'Sub',
        round: 1,
        time: '1:30',
        event: 'UFC Fight Night: Lewis vs. Spivac'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: 165 },
      { sportsbook: 'Caesars', value: 170 }
    ]
  },
  'beneil-dariush': {
    id: 'beneil-dariush',
    name: 'Beneil Dariush',
    record: '22-5-1',
    style: 'Brazilian Jiu-Jitsu',
    height: "5'10\"",
    weight: 155,
    weight_class: 'Lightweight',
    imageUrl: 'https://example.com/dariush.jpg',
    recentFights: [
      {
        date: '2024-12-07',
        opponent: 'A. Tsarukyan',
        result: 'L',
        method: 'KO/TKO',
        round: 1,
        time: '1:04',
        event: 'UFC 310: Pantoja vs. Asakura'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: -250 },
      { sportsbook: 'Caesars', value: -250 },
      { sportsbook: 'FanDuel', value: -250 }
    ]
  },
  'arman-tsarukyan': {
    id: 'arman-tsarukyan',
    name: 'Arman Tsarukyan',
    record: '21-3-0',
    style: 'Wrestling',
    height: "5'7\"",
    weight: 155,
    weight_class: 'Lightweight',
    imageUrl: 'https://example.com/tsarukyan.jpg',
    recentFights: [
      {
        date: '2024-11-09',
        opponent: 'B. Dariush',
        result: 'W',
        method: 'KO/TKO',
        round: 1,
        time: '1:04',
        event: 'UFC Fight Night: Magny vs. Prates'
      }
    ],
    odds: [
      { sportsbook: 'BetMGM', value: 195 },
      { sportsbook: 'Caesars', value: 190 },
      { sportsbook: 'FanDuel', value: 195 }
    ]
  },
  'manuel-torres': {
    id: 'manuel-torres',
    name: 'Manuel Torres',
    record: '15-3-0',
    style: 'Mixed Martial Artist',
    height: "5'10\"",
    weight: 156,
    weight_class: 'Lightweight',
    imageUrl: 'https://example.com/torres.jpg',
    recentFights: [
      {
        date: '2024-09-14',
        opponent: 'I. Bahamondes',
        result: 'L',
        method: 'KO/TKO',
        round: 1,
        time: '4:02',
        event: 'UFC 306 – Riyadh Season Noche UFC: O\'Malley vs. Dvalishvili'
      },
      {
        date: '2024-02-24',
        opponent: 'C. Duncan',
        result: 'W',
        method: 'Sub',
        round: 1,
        time: '1:46',
        event: 'UFC Fight Night: Moreno vs. Royval 2'
      }
    ],
    odds: []
  },
  'drew-dober': {
    id: 'drew-dober',
    name: 'Drew Dober',
    record: '27-14-0',
    style: 'Brazilian Jiu-Jitsu, Freestyle',
    height: "5'8\"",
    weight: 155,
    weight_class: 'Lightweight',
    imageUrl: 'https://example.com/dober.jpg',
    recentFights: [
      {
        date: '2024-07-13',
        opponent: 'J. Silva',
        result: 'L',
        method: 'TKO - Dr',
        round: 3,
        time: '1:28',
        event: 'UFC Fight Night: Namajunas vs. Cortez'
      },
      {
        date: '2024-02-03',
        opponent: 'R. Moicano',
        result: 'L',
        method: 'U Dec',
        round: 3,
        time: '5:00',
        event: 'UFC Fight Night: Dolidze vs. Imavov'
      }
    ],
    odds: []
  },
  'kelvin-gastelum': {
    id: 'kelvin-gastelum',
    name: 'Kelvin Gastelum',
    record: '20-9-0',
    style: 'Striker',
    height: "5'9\"",
    weight: 184,
    weight_class: 'Middleweight',
    imageUrl: 'https://example.com/gastelum.jpg',
    recentFights: [
      {
        date: '2024-06-22',
        opponent: 'D. Rodriguez',
        result: 'W',
        method: 'U Dec',
        round: 3,
        time: '5:00',
        event: 'UFC Fight Night: Whittaker vs. Aliskerov'
      },
      {
        date: '2023-12-02',
        opponent: 'S. Brady',
        result: 'L',
        method: 'Sub',
        round: 3,
        time: '1:43',
        event: 'UFC Fight Night: Dariush vs. Tsarukyan'
      }
    ],
    odds: []
  },
  'joe-pyfer': {
    id: 'joe-pyfer',
    name: 'Joe Pyfer',
    record: '13-3-0',
    style: 'Boxing',
    height: "6'2\"",
    weight: 185,
    weight_class: 'Middleweight',
    imageUrl: 'https://example.com/pyfer.jpg',
    recentFights: [
      {
        date: '2024-02-22',
        opponent: 'A. Fili',
        result: 'W',
        method: 'Sub',
        round: 1,
        time: '4:30',
        event: 'UFC Fight Night: Cejudo vs. Song'
      },
      {
        date: '2024-06-15',
        opponent: 'S. Nuerdanbieke',
        result: 'W',
        method: 'Sub',
        round: 3,
        time: '1:50',
        event: 'UFC Fight Night: Perez vs. Taira'
      }
    ],
    odds: []
  },
  'raul-rosas-jr': {
    id: 'raul-rosas-jr',
    name: 'Raul Rosas Jr',
    record: '10-1-0',
    style: 'Freestyle',
    height: "5'9\"",
    weight: 136,
    weight_class: 'Bantamweight',
    imageUrl: 'https://example.com/rosas.jpg',
    recentFights: [
      {
        date: '2024-09-14',
        opponent: 'Aoriqileng',
        result: 'W',
        method: 'U Dec',
        round: 3,
        time: '5:00',
        event: "UFC 306: O'Malley vs. Dvalishvili"
      },
      {
        date: '2024-06-08',
        opponent: 'R. Turcios',
        result: 'W',
        method: 'Sub',
        round: 2,
        time: '2:22',
        event: 'UFC Fight Night: Cannonier vs. Imavov'
      }
    ],
    odds: []
  },
  'vince-morales': {
    id: 'vince-morales',
    name: 'Vince Morales',
    record: '16-9-0',
    style: 'Striker',
    height: "5'7\"",
    weight: 136,
    weight_class: 'Bantamweight',
    imageUrl: 'https://example.com/morales.jpg',
    recentFights: [
      {
        date: '2025-02-15',
        opponent: 'E. Smith',
        result: 'L',
        method: 'U Dec',
        round: 3,
        time: '5:00',
        event: 'UFC Fight Night: Cannonier vs. Rodrigues'
      },
      {
        date: '2024-09-28',
        opponent: 'T. Lapilus',
        result: 'L',
        method: 'U Dec',
        round: 3,
        time: '5:00',
        event: 'UFC Fight Night: Moicano vs. Saint Denis'
      }
    ],
    odds: []
  }
};

// Upcoming Events
export const upcomingEvents: Event[] = [
  {
    id: 'ufc-fight-night-2',
    name: 'UFC Fight Night: Moreno vs. Erceg',
    date: '2024-03-29',
    location: 'Mexico City, Mexico',
    status: 'upcoming',
    fights: [
      {
        id: 'fight-1',
        eventId: 'ufc-fight-night-2',
        fight_number: 1,
        weight_class: 'Flyweight',
        card: 'main',
        redCorner: fighters['brandon-moreno'],
        blueCorner: fighters['steve-erceg']
      },
      {
        id: 'fight-2',
        eventId: 'ufc-fight-night-2',
        fight_number: 2,
        weight_class: 'Lightweight',
        card: 'main',
        redCorner: fighters['manuel-torres'],
        blueCorner: fighters['drew-dober']
      },
      {
        id: 'fight-3',
        eventId: 'ufc-fight-night-2',
        fight_number: 3,
        weight_class: 'Middleweight',
        card: 'main',
        redCorner: fighters['kelvin-gastelum'],
        blueCorner: fighters['joe-pyfer']
      },
      {
        id: 'fight-4',
        eventId: 'ufc-fight-night-2',
        fight_number: 4,
        weight_class: 'Bantamweight',
        card: 'main',
        redCorner: fighters['raul-rosas-jr'],
        blueCorner: fighters['vince-morales']
      },
      {
        id: 'fight-5',
        eventId: 'ufc-fight-night-2',
        fight_number: 5,
        weight_class: 'Bantamweight',
        card: 'prelim',
        redCorner: {
          id: 'david-martinez',
          name: 'David Martinez',
          record: '10-2-0',
          style: 'Striker',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/martinez.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'saimon-oliveira',
          name: 'Saimon Oliveira',
          record: '19-4-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/oliveira.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. Turcios',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-6',
        eventId: 'ufc-fight-night-2',
        fight_number: 6,
        weight_class: 'Flyweight',
        card: 'prelim',
        redCorner: {
          id: 'ronaldo-rodriguez',
          name: 'Ronaldo Rodriguez',
          record: '16-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'6\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/rodriguez.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Silva',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'kevin-borjas',
          name: 'Kevin Borjas',
          record: '9-2-0',
          style: 'Striker',
          height: "5'6\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/borjas.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-7',
        eventId: 'ufc-fight-night-2',
        fight_number: 7,
        weight_class: 'Flyweight',
        card: 'prelim',
        redCorner: {
          id: 'edgar-chairez',
          name: 'Edgar Chairez',
          record: '10-5-0',
          style: 'Striker',
          height: "5'6\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/chairez.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Silva',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'cj-vergara',
          name: 'CJ Vergara',
          record: '10-4-1',
          style: 'Striker',
          height: "5'6\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/vergara.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-8',
        eventId: 'ufc-fight-night-2',
        fight_number: 8,
        weight_class: 'Middleweight',
        card: 'prelim',
        redCorner: {
          id: 'jose-daniel-medina',
          name: 'Jose Daniel Medina',
          record: '12-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/medina.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'ateba-gautier',
          name: 'Ateba Gautier',
          record: '8-2-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/gautier.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-9',
        eventId: 'ufc-fight-night-2',
        fight_number: 9,
        weight_class: 'Featherweight',
        card: 'prelim',
        redCorner: {
          id: 'christian-rodriguez',
          name: 'Christian Rodriguez',
          record: '10-1-0',
          style: 'Striker',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/rodriguez.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'M. Costa',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'melquizael-costa',
          name: 'Melquizael Costa',
          record: '19-6-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/costa.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'C. Rodriguez',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-10',
        eventId: 'ufc-fight-night-2',
        fight_number: 10,
        weight_class: 'Women Strawweight',
        card: 'prelim',
        redCorner: {
          id: 'loopy-godinez',
          name: 'Loopy Godinez',
          record: '11-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'5\"",
          weight: 115,
          weight_class: 'Women Strawweight',
          imageUrl: 'https://example.com/godinez.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Polastri',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'julia-polastri',
          name: 'Julia Polastri',
          record: '12-3-0',
          style: 'Striker',
          height: "5'5\"",
          weight: 115,
          weight_class: 'Women Strawweight',
          imageUrl: 'https://example.com/polastri.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'L. Godinez',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      }
    ]
  },
  {
    id: 'ufc-fight-night-3',
    name: 'UFC Fight Night: Emmett vs. Murphy',
    date: '2024-04-05',
    location: 'UFC APEX, Las Vegas, NV',
    status: 'upcoming',
    fights: [
      {
        id: 'fight-1',
        eventId: 'ufc-fight-night-3',
        fight_number: 1,
        weight_class: 'Featherweight',
        card: 'main',
        redCorner: {
          id: 'josh-emmett',
          name: 'Josh Emmett',
          record: '19-4-0',
          style: 'Striker',
          height: "5'6\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/emmett.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'I. Topuria',
              result: 'L',
              method: 'U Dec',
              round: 5,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'lerone-murphy',
          name: 'Lerone Murphy',
          record: '15-0-1',
          style: 'Striker',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/murphy.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'G. Saint Preux',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-2',
        eventId: 'ufc-fight-night-3',
        fight_number: 2,
        weight_class: 'Featherweight',
        card: 'main',
        redCorner: {
          id: 'pat-sabatini',
          name: 'Pat Sabatini',
          record: '19-5-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/sabatini.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Lopes',
              result: 'L',
              method: 'Sub',
              round: 1,
              time: '1:30',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'joanderson-brito',
          name: 'Joanderson Brito',
          record: '17-4-1',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/brito.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Woodson',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-3',
        eventId: 'ufc-fight-night-3',
        fight_number: 3,
        weight_class: 'Bantamweight',
        card: 'main',
        redCorner: {
          id: 'cortavious-romious',
          name: 'Cortavious Romious',
          record: '9-3-0',
          style: 'Striker',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/romious.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'lee-chang-ho',
          name: 'Lee Chang-ho',
          record: '10-1-0',
          style: 'Striker',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/chang-ho.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. Turcios',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-4',
        eventId: 'ufc-fight-night-3',
        fight_number: 4,
        weight_class: 'Heavyweight',
        card: 'main',
        redCorner: {
          id: 'kennedy-nzechukwu',
          name: 'Kennedy Nzechukwu',
          record: '14-5-0',
          style: 'Striker',
          height: "6'5\"",
          weight: 205,
          weight_class: 'Heavyweight',
          imageUrl: 'https://example.com/nzechukwu.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Lewis',
              result: 'L',
              method: 'KO/TKO',
              round: 3,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'martin-buday',
          name: 'Martin Buday',
          record: '14-2-0',
          style: 'Striker',
          height: "6'4\"",
          weight: 265,
          weight_class: 'Heavyweight',
          imageUrl: 'https://example.com/buday.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'S. Spivac',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-5',
        eventId: 'ufc-fight-night-3',
        fight_number: 5,
        weight_class: 'Middleweight',
        card: 'prelim',
        redCorner: {
          id: 'brad-tavares',
          name: 'Brad Tavares',
          record: '20-11-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/tavares.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'gerald-meerschaert',
          name: 'Gerald Meerschaert',
          record: '37-18-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/meerschaert.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'L',
              method: 'KO/TKO',
              round: 2,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-6',
        eventId: 'ufc-fight-night-3',
        fight_number: 6,
        weight_class: 'Middleweight',
        card: 'prelim',
        redCorner: {
          id: 'torrez-finney',
          name: 'Torrez Finney',
          record: '10-0-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/finney.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'robert-valentin',
          name: 'Robert Valentin',
          record: '10-1-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/valentin.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Imavov',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-7',
        eventId: 'ufc-fight-night-3',
        fight_number: 7,
        weight_class: 'Flyweight',
        card: 'prelim',
        redCorner: {
          id: 'ode-osbourne',
          name: 'Ode Osbourne',
          record: '12-8-0',
          style: 'Striker',
          height: "5'7\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/osbourne.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Silva',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'luis-gurule',
          name: 'Luis Gurule',
          record: '10-0-0',
          style: 'Striker',
          height: "5'7\"",
          weight: 125,
          weight_class: 'Flyweight',
          imageUrl: 'https://example.com/gurule.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-8',
        eventId: 'ufc-fight-night-3',
        fight_number: 8,
        weight_class: 'Bantamweight',
        card: 'prelim',
        redCorner: {
          id: 'davey-grant',
          name: 'Davey Grant',
          record: '16-7-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/grant.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. Turcios',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'daniel-santos',
          name: 'Daniel Santos',
          record: '12-2-0',
          style: 'Striker',
          height: "5'8\"",
          weight: 135,
          weight_class: 'Bantamweight',
          imageUrl: 'https://example.com/santos.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Martinez',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-9',
        eventId: 'ufc-fight-night-3',
        fight_number: 9,
        weight_class: 'Women Flyweight',
        card: 'prelim',
        redCorner: {
          id: 'diana-belbita',
          name: 'Diana Belbiță',
          record: '15-9-0',
          style: 'Striker',
          height: "5'7\"",
          weight: 125,
          weight_class: 'Women Flyweight',
          imageUrl: 'https://example.com/belbita.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Barbosa',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'dione-barbosa',
          name: 'Dione Barbosa',
          record: '7-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'7\"",
          weight: 125,
          weight_class: 'Women Flyweight',
          imageUrl: 'https://example.com/barbosa.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Belbiță',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-10',
        eventId: 'ufc-fight-night-3',
        fight_number: 10,
        weight_class: 'Welterweight',
        card: 'prelim',
        redCorner: {
          id: 'rhys-mckee',
          name: 'Rhys McKee',
          record: '13-6-1',
          style: 'Striker',
          height: "6'1\"",
          weight: 170,
          weight_class: 'Welterweight',
          imageUrl: 'https://example.com/mckee.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Frunza',
              result: 'W',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'daniel-frunza',
          name: 'Daniel Frunza',
          record: '9-2-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 170,
          weight_class: 'Welterweight',
          imageUrl: 'https://example.com/frunza.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. McKee',
              result: 'L',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      }
    ]
  },
  {
    id: 'ufc-314',
    name: 'UFC 314: Volkanovski vs. Lopes',
    date: '2024-04-12',
    location: 'Kaseya Center, Miami, FL',
    status: 'upcoming',
    fights: [
      {
        id: 'fight-1',
        eventId: 'ufc-314',
        fight_number: 1,
        weight_class: 'Featherweight',
        card: 'main',
        redCorner: fighters['alexander-volkanovski'],
        blueCorner: fighters['diego-lopes']
      },
      {
        id: 'fight-2',
        eventId: 'ufc-314',
        fight_number: 2,
        weight_class: 'Lightweight',
        card: 'main',
        redCorner: {
          id: 'michael-chandler',
          name: 'Michael Chandler',
          record: '23-9-0',
          style: 'Wrestling',
          height: "5'8\"",
          weight: 155,
          weight_class: 'Lightweight',
          imageUrl: 'https://example.com/chandler.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'C. McGregor',
              result: 'L',
              method: 'KO/TKO',
              round: 2,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'paddy-pimblett',
          name: 'Paddy Pimblett',
          record: '22-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'10\"",
          weight: 155,
          weight_class: 'Lightweight',
          imageUrl: 'https://example.com/pimblett.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'T. Ferguson',
              result: 'W',
              method: 'Sub',
              round: 2,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-3',
        eventId: 'ufc-314',
        fight_number: 3,
        weight_class: 'Featherweight',
        card: 'main',
        redCorner: {
          id: 'bryce-mitchell',
          name: 'Bryce Mitchell',
          record: '17-3-0',
          style: 'Wrestling',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/mitchell.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Silva',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'jean-silva',
          name: 'Jean Silva',
          record: '15-2-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/silva.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'B. Mitchell',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-4',
        eventId: 'ufc-314',
        fight_number: 4,
        weight_class: 'Welterweight',
        card: 'main',
        redCorner: {
          id: 'geoff-neal',
          name: 'Geoff Neal',
          record: '16-6-0',
          style: 'Striker',
          height: "5'11\"",
          weight: 170,
          weight_class: 'Welterweight',
          imageUrl: 'https://example.com/neal.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'I. Garry',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'carlos-prates',
          name: 'Carlos Prates',
          record: '21-6-0',
          style: 'Striker',
          height: "5'11\"",
          weight: 170,
          weight_class: 'Welterweight',
          imageUrl: 'https://example.com/prates.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'T. Means',
              result: 'W',
              method: 'KO/TKO',
              round: 2,
              time: '1:35',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-5',
        eventId: 'ufc-314',
        fight_number: 5,
        weight_class: 'Light Heavyweight',
        card: 'prelim',
        redCorner: {
          id: 'nikita-krylov',
          name: 'Nikita Krylov',
          record: '30-9-0',
          style: 'Striker',
          height: "6'3\"",
          weight: 205,
          weight_class: 'Light Heavyweight',
          imageUrl: 'https://example.com/krylov.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. Spann',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'dominick-reyes',
          name: 'Dominick Reyes',
          record: '14-4-0',
          style: 'Striker',
          height: "6'4\"",
          weight: 205,
          weight_class: 'Light Heavyweight',
          imageUrl: 'https://example.com/reyes.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'R. Spann',
              result: 'L',
              method: 'KO/TKO',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-6',
        eventId: 'ufc-314',
        fight_number: 6,
        weight_class: 'Featherweight',
        card: 'prelim',
        redCorner: {
          id: 'dan-ige',
          name: 'Dan Ige',
          record: '18-9-0',
          style: 'Striker',
          height: "5'7\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/ige.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'A. Fili',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'sean-woodson',
          name: 'Sean Woodson',
          record: '13-1-1',
          style: 'Striker',
          height: "6'2\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/woodson.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Ige',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-7',
        eventId: 'ufc-314',
        fight_number: 7,
        weight_class: 'Women Strawweight',
        card: 'prelim',
        redCorner: {
          id: 'yan-xiaonan',
          name: 'Yan Xiaonan',
          record: '19-4-0',
          style: 'Striker',
          height: "5'5\"",
          weight: 115,
          weight_class: 'Women Strawweight',
          imageUrl: 'https://example.com/xiaonan.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'V. Jandiroba',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'virna-jandiroba',
          name: 'Virna Jandiroba',
          record: '21-3-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'5\"",
          weight: 115,
          weight_class: 'Women Strawweight',
          imageUrl: 'https://example.com/jandiroba.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'Y. Xiaonan',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-8',
        eventId: 'ufc-314',
        fight_number: 8,
        weight_class: 'Lightweight',
        card: 'prelim',
        redCorner: {
          id: 'jim-miller',
          name: 'Jim Miller',
          record: '38-18-0',
          style: 'Brazilian Jiu-Jitsu',
          height: "5'8\"",
          weight: 155,
          weight_class: 'Lightweight',
          imageUrl: 'https://example.com/miller.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'C. Hooper',
              result: 'W',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'chase-hooper',
          name: 'Chase Hooper',
          record: '13-3-1',
          style: 'Brazilian Jiu-Jitsu',
          height: "6'1\"",
          weight: 155,
          weight_class: 'Lightweight',
          imageUrl: 'https://example.com/hooper.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Miller',
              result: 'L',
              method: 'Sub',
              round: 1,
              time: '2:45',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-9',
        eventId: 'ufc-314',
        fight_number: 9,
        weight_class: 'Middleweight',
        card: 'prelim',
        redCorner: {
          id: 'sedriques-dumas',
          name: 'Sedriques Dumas',
          record: '10-2-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/dumas.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'M. Oleksiejczuk',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'michal-oleksiejczuk',
          name: 'Michal Oleksiejczuk',
          record: '19-9-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 185,
          weight_class: 'Middleweight',
          imageUrl: 'https://example.com/oleksiejczuk.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'S. Dumas',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      },
      {
        id: 'fight-10',
        eventId: 'ufc-314',
        fight_number: 10,
        weight_class: 'Featherweight',
        card: 'prelim',
        redCorner: {
          id: 'darren-elkins',
          name: 'Darren Elkins',
          record: '29-11-0',
          style: 'Wrestling',
          height: "5'10\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/elkins.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'J. Erosa',
              result: 'W',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: -250 },
            { sportsbook: 'Caesars', value: -250 }
          ]
        },
        blueCorner: {
          id: 'julian-erosa',
          name: 'Julian Erosa',
          record: '30-12-0',
          style: 'Striker',
          height: "6'1\"",
          weight: 145,
          weight_class: 'Featherweight',
          imageUrl: 'https://example.com/erosa.jpg',
          recentFights: [
            {
              date: '2024-02-17',
              opponent: 'D. Elkins',
              result: 'L',
              method: 'U Dec',
              round: 3,
              time: '5:00',
              event: 'UFC Fight Night: Lewis vs. Spivac'
            }
          ],
          odds: [
            { sportsbook: 'BetMGM', value: 195 },
            { sportsbook: 'Caesars', value: 190 }
          ]
        }
      }
    ]
  }
];

// Past Events
export const pastEvents: Event[] = [
  {
    id: 'ufc-313',
    name: 'UFC 313: Moreno vs. Royval 2',
    date: '2024-03-30',
    location: 'Mexico City Arena, Mexico City, Mexico',
    status: 'past',
    fights: [
      // Add fights...
    ]
  },
  // Add more past events...
];

// Coming Soon Events
export const comingSoonEvents: ComingSoonEvent[] = [
  {
    id: 'ufc-315',
    name: 'UFC 315: Holloway vs. Gaethje',
    date: '2024-04-13',
    status: 'coming_soon',
    fights: 13
  },
  // Add more coming soon events...
];

// Helper function to update events
export function updateEvents(newEvents: Event[]) {
  // Implementation for updating events
  // This will be used when new cards are announced
}

// Helper function to add a coming soon event
export function addComingSoonEvent(event: ComingSoonEvent) {
  // Implementation for adding new coming soon events
}

// Helper function to convert coming soon event to full event
export function convertToFullEvent(comingSoon: ComingSoonEvent, fights: Fight[]): Event {
  // Implementation for converting coming soon event to full event
  return {
    id: comingSoon.id,
    name: comingSoon.name,
    date: comingSoon.date,
    location: '', // To be filled when announced
    status: 'upcoming',
    fights
  };
} 