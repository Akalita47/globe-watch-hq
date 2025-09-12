import { Event } from '@/types/events';

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Military buildup reported near Ukraine border',
    description: 'Satellite imagery shows significant movement of Russian troops and equipment near the Ukrainian border, raising concerns...',
    severity: 'critical',
    source: {
      name: 'CNN',
      type: 'news'
    },
    location: {
      country: 'Russia',
      city: 'Moscow',
      coordinates: [55.7558, 37.6176]
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    tags: ['military', 'ukraine', 'russia'],
    url: 'https://cnn.com/example'
  },
  {
    id: '2',
    title: 'Protests erupt in Tehran after economic sanctions',
    description: 'Thousands gathered in central Tehran protesting rising food prices and economic hardship following new international sanctions...',
    severity: 'high',
    source: {
      name: 'Reuters',
      type: 'news'
    },
    location: {
      country: 'Iran',
      city: 'Tehran',
      coordinates: [35.6892, 51.3890]
    },
    timestamp: new Date(Date.now() - 42 * 60 * 1000), // 42 min ago
    tags: ['protests', 'economy', 'sanctions'],
    url: 'https://reuters.com/example'
  },
  {
    id: '3',
    title: 'ASEAN summit concludes with trade agreement',
    description: 'ASEAN members signed a new regional trade pact aimed at reducing tariffs and improving supply chain resilience in the region...',
    severity: 'medium',
    source: {
      name: 'BBC',
      type: 'news'
    },
    location: {
      country: 'Indonesia',
      city: 'Jakarta',
      coordinates: [-6.2088, 106.8456]
    },
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    tags: ['trade', 'asean', 'diplomacy'],
    url: 'https://bbc.com/example'
  },
  {
    id: '4',
    title: 'Diplomatic meeting between US and China officials',
    description: 'Senior US and Chinese officials met in Beijing to discuss climate cooperation and trade relations amid ongoing tensions...',
    severity: 'medium',
    source: {
      name: 'AP',
      type: 'news'
    },
    location: {
      country: 'China',
      city: 'Beijing',
      coordinates: [39.9042, 116.4074]
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tags: ['diplomacy', 'us-china', 'trade'],
    url: 'https://apnews.com/example'
  },
  {
    id: '5',
    title: 'Cybersecurity breach at European banking consortium',
    description: 'A sophisticated cyber attack targeted multiple European banks, potentially compromising customer data and financial records...',
    severity: 'critical',
    source: {
      name: 'EU CERT',
      type: 'government'
    },
    location: {
      country: 'Germany',
      city: 'Frankfurt',
      coordinates: [50.1109, 8.6821]
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    tags: ['cybersecurity', 'banking', 'europe'],
    url: 'https://cert.europa.eu/example'
  },
  {
    id: '6',
    title: 'Natural disaster response coordinated in Philippines',
    description: 'International aid organizations coordinate relief efforts following devastating typhoon that affected millions in the archipelago...',
    severity: 'high',
    source: {
      name: 'UN OCHA',
      type: 'government'
    },
    location: {
      country: 'Philippines',
      city: 'Manila',
      coordinates: [14.5995, 120.9842]
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    tags: ['disaster', 'humanitarian', 'typhoon'],
    url: 'https://unocha.org/example'
  },
  {
    id: '7',
    title: 'Energy crisis discussions in European Parliament',
    description: 'EU lawmakers debate emergency measures to address rising energy costs and supply security concerns ahead of winter season...',
    severity: 'high',
    source: {
      name: 'Euronews',
      type: 'news'
    },
    location: {
      country: 'Belgium',
      city: 'Brussels',
      coordinates: [50.8503, 4.3517]
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    tags: ['energy', 'europe', 'crisis'],
    url: 'https://euronews.com/example'
  },
  {
    id: '8',
    title: 'Trade route disruption in Red Sea region',
    description: 'Commercial shipping reports delays and rerouting due to security concerns in critical maritime trade corridor...',
    severity: 'medium',
    source: {
      name: 'Lloyd\'s List',
      type: 'news'
    },
    location: {
      country: 'Egypt',
      city: 'Suez',
      coordinates: [29.9668, 32.5498]
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    tags: ['shipping', 'trade', 'security'],
    url: 'https://lloydslist.com/example'
  }
];