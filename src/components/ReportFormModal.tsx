import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Switch, Alert, Image, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { HazardReport } from '../types/hazard';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<HazardReport, 'id' | 'timestamp'> & { imageUri?: string }) => void;
}

export default function ReportFormModal({ visible, onClose, onSubmit }: Props) {
  const [type, setType] = useState<HazardReport['type']>('flood');
  const [severity, setSeverity] = useState<HazardReport['severity']>('medium');
  const [barangay, setBarangay] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const requestLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } else {
        Alert.alert('Permission needed', 'Location is required to submit a report.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not get your location.');
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission needed', 'Camera access is required to take photos.');
    }
  };

  const handleSubmit = () => {
    if (!latitude || !longitude) {
      Alert.alert('Missing location', 'Please allow location access and try again.');
      requestLocation();
      return;
    }
    if (!barangay.trim()) {
      Alert.alert('Missing barangay', 'Please enter the barangay name.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing description', 'Please describe the hazard.');
      return;
    }

    onSubmit({
      type,
      severity,
      barangay: barangay.trim(),
      description: description.trim(),
      latitude,
      longitude,
      imageUri: imageUri || undefined,
    });

    // Reset form
    setType('flood');
    setSeverity('medium');
    setBarangay('');
    setDescription('');
    setImageUri(null);
    onClose();
  };

  const typeOptions: HazardReport['type'][] = ['flood', 'storm', 'earthquake', 'landslide'];
  const severityOptions: HazardReport['severity'][] = ['low', 'medium', 'high'];

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Report Hazard</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hazard Type */}
            <Text style={styles.label}>Hazard Type</Text>
            <View style={styles.optionsRow}>
              {typeOptions.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.optionButton, type === t && styles.optionActive]}
                  onPress={() => setType(t)}
                >
                  <Text style={[styles.optionText, type === t && styles.optionActiveText]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Severity */}
            <Text style={styles.label}>Severity</Text>
            <View style={styles.optionsRow}>
              {severityOptions.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.optionButton, severity === s && styles.optionActive]}
                  onPress={() => setSeverity(s)}
                >
                  <Text style={[styles.optionText, severity === s && styles.optionActiveText]}>
                    {s.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Barangay */}
            <Text style={styles.label}>Barangay / Location</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Barangay 123, Manila"
              value={barangay}
              onChangeText={setBarangay}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the hazard (depth, damage, etc.)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Photo */}
            <Text style={styles.label}>Photo (optional)</Text>
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                <Ionicons name="camera" size={24} color="#ff5722" />
                <Text style={styles.photoButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                <Ionicons name="images" size={24} color="#ff5722" />
                <Text style={styles.photoButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}

            {locationLoading && (
              <View style={styles.locationLoading}>
                <ActivityIndicator size="small" color="#ff5722" />
                <Text style={styles.locationLoadingText}>Getting your location...</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Report</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
    maxHeight: '85%',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: verticalScale(10), marginBottom: verticalScale(16) },
  title: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#333' },
  closeBtn: { padding: scale(5) },
  closeText: { fontSize: moderateScale(22), fontWeight: 'bold', color: '#999' },
  label: { fontSize: moderateScale(14), fontWeight: '600', color: '#555', marginTop: verticalScale(12), marginBottom: verticalScale(6) },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionButton: { paddingHorizontal: scale(16), paddingVertical: verticalScale(8), borderRadius: scale(20), backgroundColor: '#f0f0f0', marginRight: 10, marginBottom: 8 },
  optionActive: { backgroundColor: '#ff5722' },
  optionText: { fontSize: moderateScale(14), color: '#333' },
  optionActiveText: { color: 'white', fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: scale(8), padding: scale(12), fontSize: moderateScale(16), marginBottom: verticalScale(8) },
  textArea: { height: verticalScale(80), textAlignVertical: 'top' },
  photoRow: { flexDirection: 'row', marginBottom: verticalScale(12) },
  photoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: scale(16), paddingVertical: verticalScale(8), borderRadius: scale(20), marginRight: 12 },
  photoButtonText: { marginLeft: 6, fontSize: moderateScale(14), color: '#ff5722' },
  previewImage: { width: '100%', height: scale(200), borderRadius: scale(10), marginBottom: verticalScale(12) },
  locationLoading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: verticalScale(8) },
  locationLoadingText: { marginLeft: 8, fontSize: moderateScale(14), color: '#ff5722' },
  submitButton: { backgroundColor: '#ff5722', paddingVertical: verticalScale(14), borderRadius: scale(10), alignItems: 'center', marginTop: verticalScale(16) },
  submitText: { color: 'white', fontSize: moderateScale(16), fontWeight: 'bold' },
});