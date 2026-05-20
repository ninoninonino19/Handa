export interface HazardReport {
  id: string;
  latitude: number;
  longitude: number;
  type: 'flood' | 'storm' | 'earthquake' | 'landslide';
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  barangay?: string;
  imageUri?: string;          // local uri of photo
  isUserReport?: boolean;     // to distinguish from mock/API data
}