import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useHazards } from '../../src/context/HazardContext';
import { getPinColorBySeverity } from '../../src/utils/helpers';
import HazardModal from '../../src/components/HazardModal';
import ReportFormModal from '../../src/components/ReportFormModal';
import AIChatModal from '../../src/components/AIChatModal';
import { HazardReport } from '../../src/types/hazard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UserLocation = Region;

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { hazards, loading, addUserReport } = useHazards();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedHazard, setSelectedHazard] = useState<HazardReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [aiModalVisible, setAiModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission denied');
        Alert.alert('Permission needed', 'Enable location to see nearby hazards');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
      setUserLocation(region);
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    })();
  }, []);

  const centerMapOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(userLocation, 500);
    } else {
      Alert.alert('Location not available', 'Unable to get your current location.');
    }
  };

  if (errorMsg) return <View style={styles.container}><Text>{errorMsg}</Text></View>;
  if (!userLocation) return <View style={styles.container}><ActivityIndicator size="large" /><Text>Loading map...</Text></View>;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={userLocation}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {hazards.map(hazard => (
          <Marker
            key={hazard.id}
            coordinate={{ latitude: hazard.latitude, longitude: hazard.longitude }}
            pinColor={getPinColorBySeverity(hazard.severity)}
            onPress={() => { setSelectedHazard(hazard); setModalVisible(true); }}
          />
        ))}
      </MapView>

      <HazardModal visible={modalVisible} hazard={selectedHazard} onClose={() => setModalVisible(false)} />
      <ReportFormModal visible={reportModalVisible} onClose={() => setReportModalVisible(false)} onSubmit={addUserReport} />
      <AIChatModal visible={aiModalVisible} onClose={() => setAiModalVisible(false)} />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Add Report Button (green, bottom‑left) */}
      <TouchableOpacity
        style={[styles.addButton, { bottom: insets.bottom + 20 }]}
        onPress={() => setReportModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* AI Assistant Button (blue, bottom‑center) */}
      <TouchableOpacity
        style={[styles.aiButton, { bottom: insets.bottom + 20 }]}
        onPress={() => setAiModalVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* Locate Me Button (orange, bottom‑right) */}
      <TouchableOpacity
        style={[styles.locationButton, { bottom: insets.bottom + 20 }]}
        onPress={centerMapOnUser}
        activeOpacity={0.8}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1, width: '100%' },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    left: 20,
    backgroundColor: '#4caf50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  aiButton: {
    position: 'absolute',
    left: '50%',
    marginLeft: -28, // half of width
    backgroundColor: '#2196f3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  locationButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#ff5722',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});