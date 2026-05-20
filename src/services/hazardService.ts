import { mockHazards } from '../mock/hazards';
import { HazardReport } from '../types/hazard';

const USE_MOCK = true;   // set to false when you have real API key

export async function fetchHazards(): Promise<HazardReport[]> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockHazards;
  }
  // Real API call (replace with your endpoint and key)
  try {
    const response = await fetch('https://api.mapakalamidad.ph/reports?apikey=YOUR_KEY');
    const data = await response.json();
    return data.reports.map((report: any) => ({
      id: report.id,
      latitude: report.lat,
      longitude: report.lng,
      type: report.hazard_type,
      description: report.description,
      timestamp: report.created_at,
      severity: report.severity || 'medium',
      barangay: report.barangay,
    }));
  } catch (error) {
    console.error('API failed, falling back to mock', error);
    return mockHazards;
  }
}

export type { HazardReport };