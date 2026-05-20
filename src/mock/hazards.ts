// src/mock/hazards.ts
export interface HazardReport {
  id: string;
  latitude: number;
  longitude: number;
  type: 'flood' | 'storm' | 'earthquake' | 'landslide';
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  barangay?: string;
}

// Helper to generate timestamps within the last 6 hours
const recentTimestamp = (hoursAgo: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
};

export const mockHazards: HazardReport[] = [
  // ===== METRO MANILA =====
  {
    id: 'mm-1',
    latitude: 14.5995,
    longitude: 120.9842,
    type: 'flood',
    description: 'Waist-deep flooding along Taft Avenue, vehicles stranded',
    timestamp: recentTimestamp(0.5),
    severity: 'high',
    barangay: 'Malate, Manila',
  },
  {
    id: 'mm-2',
    latitude: 14.5547,
    longitude: 120.9984,
    type: 'flood',
    description: 'Knee-deep flood near Paco Church, residents evacuating',
    timestamp: recentTimestamp(1),
    severity: 'high',
    barangay: 'Paco, Manila',
  },
  {
    id: 'mm-3',
    latitude: 14.6250,
    longitude: 121.0020,
    type: 'storm',
    description: 'Strong winds, falling trees reported in Scout area',
    timestamp: recentTimestamp(0.2),
    severity: 'high',
    barangay: 'Quezon City',
  },
  {
    id: 'mm-4',
    latitude: 14.5705,
    longitude: 121.0430,
    type: 'flood',
    description: 'Chest-deep flooding in Barangay Rizal, rescue ongoing',
    timestamp: recentTimestamp(1.5),
    severity: 'high',
    barangay: 'Makati City',
  },
  {
    id: 'mm-5',
    latitude: 14.5120,
    longitude: 121.0120,
    type: 'flood',
    description: 'Neck-deep flood, many houses submerged',
    timestamp: recentTimestamp(2),
    severity: 'high',
    barangay: 'Pasay City',
  },
  {
    id: 'mm-6',
    latitude: 14.6762,
    longitude: 121.0437,
    type: 'storm',
    description: 'Roofs blown off in Barangay Holy Spirit',
    timestamp: recentTimestamp(0.8),
    severity: 'high',
    barangay: 'Quezon City',
  },
  {
    id: 'mm-7',
    latitude: 14.6360,
    longitude: 121.0970,
    type: 'flood',
    description: 'Waist-deep along Marcos Highway',
    timestamp: recentTimestamp(1.2),
    severity: 'high',
    barangay: 'Marikina City',
  },
  {
    id: 'mm-8',
    latitude: 14.4356,
    longitude: 120.9952,
    type: 'flood',
    description: 'Moderate flooding near SM Sucat',
    timestamp: recentTimestamp(0.3),
    severity: 'medium',
    barangay: 'Parañaque City',
  },

  // ===== CENTRAL LUZON (Bulacan, Pampanga, Nueva Ecija) =====
  {
    id: 'cl-1',
    latitude: 14.8643,
    longitude: 120.9121,
    type: 'flood',
    description: 'Widespread flooding, almost waist-deep in downtown',
    timestamp: recentTimestamp(1),
    severity: 'high',
    barangay: 'Malolos, Bulacan',
  },
  {
    id: 'cl-2',
    latitude: 15.0516,
    longitude: 120.7080,
    type: 'flood',
    description: 'Knee-deep, some roads impassable',
    timestamp: recentTimestamp(2),
    severity: 'medium',
    barangay: 'San Fernando, Pampanga',
  },
  {
    id: 'cl-3',
    latitude: 15.5064,
    longitude: 120.9695,
    type: 'storm',
    description: 'Very strong winds, power lines down',
    timestamp: recentTimestamp(0.5),
    severity: 'high',
    barangay: 'Cabanatuan, Nueva Ecija',
  },
  {
    id: 'cl-4',
    latitude: 14.9348,
    longitude: 120.9579,
    type: 'flood',
    description: 'Chest-deep, rescue boats deployed',
    timestamp: recentTimestamp(0.8),
    severity: 'high',
    barangay: 'Calumpit, Bulacan',
  },
  {
    id: 'cl-5',
    latitude: 15.0880,
    longitude: 120.8872,
    type: 'landslide',
    description: 'Minor landslide blocking a section of highway',
    timestamp: recentTimestamp(1.2),
    severity: 'medium',
    barangay: 'Candaba, Pampanga',
  },

  // ===== CALABARZON (Laguna, Cavite, Batangas, Rizal) =====
  {
    id: 'cal-1',
    latitude: 14.3477,
    longitude: 121.0949,
    type: 'flood',
    description: 'Waist-deep along the highway',
    timestamp: recentTimestamp(1.5),
    severity: 'high',
    barangay: 'Biñan, Laguna',
  },
  {
    id: 'cal-2',
    latitude: 14.2419,
    longitude: 121.1184,
    type: 'flood',
    description: 'Knee-deep, heavy traffic',
    timestamp: recentTimestamp(2),
    severity: 'medium',
    barangay: 'Calamba, Laguna',
  },
  {
    id: 'cal-3',
    latitude: 14.4791,
    longitude: 120.8985,
    type: 'storm',
    description: 'Roof damage reported in several houses',
    timestamp: recentTimestamp(0.7),
    severity: 'high',
    barangay: 'Bacoor, Cavite',
  },
  {
    id: 'cal-4',
    latitude: 14.5561,
    longitude: 121.1483,
    type: 'landslide',
    description: 'Small rockslide near the highway, passable',
    timestamp: recentTimestamp(1),
    severity: 'low',
    barangay: 'Angono, Rizal',
  },
  {
    id: 'cal-5',
    latitude: 13.7546,
    longitude: 121.0551,
    type: 'flood',
    description: 'Waist-deep in low-lying areas',
    timestamp: recentTimestamp(3),
    severity: 'medium',
    barangay: 'Batangas City',
  },
  {
    id: 'cal-6',
    latitude: 14.2071,
    longitude: 121.1607,
    type: 'flood',
    description: 'Chest-deep, evacuations ongoing',
    timestamp: recentTimestamp(1.2),
    severity: 'high',
    barangay: 'Los Baños, Laguna',
  },

  // ===== ILOCOS REGION (La Union, Pangasinan) =====
  {
    id: 'ilocos-1',
    latitude: 16.5000,
    longitude: 120.3833,
    type: 'storm',
    description: 'Very strong winds, some trees down',
    timestamp: recentTimestamp(0.5),
    severity: 'high',
    barangay: 'San Fernando, La Union',
  },
  {
    id: 'ilocos-2',
    latitude: 16.0433,
    longitude: 120.3311,
    type: 'flood',
    description: 'Knee-deep near the city market',
    timestamp: recentTimestamp(1),
    severity: 'medium',
    barangay: 'Lingayen, Pangasinan',
  },
  {
    id: 'ilocos-3',
    latitude: 15.9800,
    longitude: 120.5800,
    type: 'flood',
    description: 'Waist-deep in several barangays',
    timestamp: recentTimestamp(2),
    severity: 'high',
    barangay: 'Manaoag, Pangasinan',
  },

  // ===== CORDILLERA (Benguet, Ifugao) – landslides / moderate =====
  {
    id: 'car-1',
    latitude: 16.4145,
    longitude: 120.5951,
    type: 'landslide',
    description: 'Major road blocked, clearing underway',
    timestamp: recentTimestamp(1.5),
    severity: 'high',
    barangay: 'Baguio City',
  },
  {
    id: 'car-2',
    latitude: 16.9167,
    longitude: 121.1667,
    type: 'landslide',
    description: 'Minor rockslide, passable with care',
    timestamp: recentTimestamp(2),
    severity: 'low',
    barangay: 'Kiangan, Ifugao',
  },

  // ===== BICOL REGION (margin of typhoon) =====
  {
    id: 'bicol-1',
    latitude: 13.6244,
    longitude: 123.1889,
    type: 'storm',
    description: 'Strong winds, sporadic power outages',
    timestamp: recentTimestamp(3),
    severity: 'medium',
    barangay: 'Naga City',
  },
  {
    id: 'bicol-2',
    latitude: 13.1492,
    longitude: 123.7443,
    type: 'flood',
    description: 'Knee-deep flooding near the airport',
    timestamp: recentTimestamp(4),
    severity: 'medium',
    barangay: 'Legazpi City',
  },
];