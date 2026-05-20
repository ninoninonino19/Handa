// src/context/HazardContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { fetchHazards, HazardReport } from '../services/hazardService';

const STORAGE_KEY = '@user_reports';

interface FilterState {
  searchText: string;
  types: {
    flood: boolean;
    storm: boolean;
    earthquake: boolean;
    landslide: boolean;
  };
  severities: {
    high: boolean;
    medium: boolean;
    low: boolean;
  };
}

interface HazardContextType {
  hazards: HazardReport[];
  filteredHazards: HazardReport[];
  loading: boolean;
  refreshHazards: () => Promise<void>;
  addUserReport: (report: Omit<HazardReport, 'id' | 'timestamp' | 'isUserReport'> & { imageUri?: string }) => Promise<void>;
  filters: FilterState;
  setSearchText: (text: string) => void;
  toggleType: (type: keyof FilterState['types']) => void;
  toggleSeverity: (severity: keyof FilterState['severities']) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  searchText: '',
  types: { flood: false, storm: false, earthquake: false, landslide: false },
  severities: { high: false, medium: false, low: false },
};

const HazardContext = createContext<HazardContextType | undefined>(undefined);

export function HazardProvider({ children }: { children: ReactNode }) {
  const [fetchedHazards, setFetchedHazards] = useState<HazardReport[]>([]);
  const [userReports, setUserReports] = useState<HazardReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const loadUserReports = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setUserReports(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load user reports:', error);
    }
  };

  const saveUserReports = async (reports: HazardReport[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Failed to save user reports:', error);
    }
  };

  const addUserReport = async (report: Omit<HazardReport, 'id' | 'timestamp' | 'isUserReport'> & { imageUri?: string }) => {
    const newReport: HazardReport = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...report,
      timestamp: new Date().toISOString(),
      isUserReport: true,
    };
    const updated = [newReport, ...userReports];
    setUserReports(updated);
    await saveUserReports(updated);

    // 🔔 Trigger push notification for high‑severity hazards (only if backend URL is configured)
    if (newReport.severity === 'high') {
      const backendUrl = Constants.expoConfig?.extra?.backendUrl;
      if (backendUrl) {
        try {
          await fetch(`${backendUrl}/send-notification`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: '⚠️ New High‑Severity Hazard',
              body: `${newReport.type.toUpperCase()} in ${newReport.barangay || 'your area'} – ${newReport.description.substring(0, 100)}`,
              data: { hazardId: newReport.id, type: newReport.type },
            }),
          });
        } catch (error) {
          console.error('Failed to send notification request:', error);
        }
      } else {
        console.warn('Backend URL not configured. Push notification not sent.');
      }
    }
  };

  const refreshHazards = async () => {
    setLoading(true);
    try {
      const data = await fetchHazards();
      setFetchedHazards(data);
      await loadUserReports();
    } catch (error) {
      console.error('Failed to refresh hazards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshHazards();
  }, []);

  const allHazards = useMemo(() => [...fetchedHazards, ...userReports], [fetchedHazards, userReports]);

  const filteredHazards = useMemo(() => {
    let result = [...allHazards];

    if (filters.searchText.trim()) {
      const searchLower = filters.searchText.toLowerCase();
      result = result.filter(
        h => h.barangay?.toLowerCase().includes(searchLower) || h.description.toLowerCase().includes(searchLower)
      );
    }

    const activeTypes = Object.entries(filters.types)
      .filter(([, active]) => active)
      .map(([type]) => type);
    const activeSeverities = Object.entries(filters.severities)
      .filter(([, active]) => active)
      .map(([severity]) => severity);

    const hasTypeFilter = activeTypes.length > 0;
    const hasSeverityFilter = activeSeverities.length > 0;

    if (!hasTypeFilter && !hasSeverityFilter) {
      return result;
    }

    result = result.filter(h => {
      const matchesType = hasTypeFilter && activeTypes.includes(h.type);
      const matchesSeverity = hasSeverityFilter && h.severity && activeSeverities.includes(h.severity);
      return matchesType || matchesSeverity;
    });

    return result;
  }, [allHazards, filters]);

  const setSearchText = (text: string) => setFilters(prev => ({ ...prev, searchText: text }));
  const toggleType = (type: keyof FilterState['types']) =>
    setFilters(prev => ({ ...prev, types: { ...prev.types, [type]: !prev.types[type] } }));
  const toggleSeverity = (severity: keyof FilterState['severities']) =>
    setFilters(prev => ({ ...prev, severities: { ...prev.severities, [severity]: !prev.severities[severity] } }));
  const resetFilters = () => setFilters(defaultFilters);

  return (
    <HazardContext.Provider
      value={{
        hazards: allHazards,
        filteredHazards,
        loading,
        refreshHazards,
        addUserReport,
        filters,
        setSearchText,
        toggleType,
        toggleSeverity,
        resetFilters,
      }}
    >
      {children}
    </HazardContext.Provider>
  );
}

export function useHazards() {
  const context = useContext(HazardContext);
  if (!context) throw new Error('useHazards must be used within HazardProvider');
  return context;
}