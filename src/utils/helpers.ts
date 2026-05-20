import { HazardReport } from '../types/hazard';

export const getPinColorBySeverity = (severity?: string): string => {
  switch (severity) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'green';
    default: return 'gray';
  }
};

export const getRecommendation = (severity?: string): string => {
  switch (severity) {
    case 'high':
      return 'Evacuate immediately if in the area. Follow local authorities.';
    case 'medium':
      return 'Prepare emergency kit. Stay tuned for updates.';
    case 'low':
      return 'Remain cautious. Monitor official channels.';
    default:
      return 'Stay informed.';
  }
};