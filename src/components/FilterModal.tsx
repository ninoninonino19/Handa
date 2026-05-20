import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, Dimensions } from 'react-native';
import { useHazards } from '../context/HazardContext';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function FilterModal({ visible, onClose }: Props) {
  const { filters, setSearchText, toggleType, toggleSeverity, resetFilters } = useHazards();

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Hazards</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search</Text>
              <TextInput style={styles.searchInput} placeholder="Barangay or description..." value={filters.searchText} onChangeText={setSearchText} />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hazard Type</Text>
              {Object.entries(filters.types).map(([key, value]) => (
                <View key={key} style={styles.filterRow}>
                  <Text style={styles.filterLabel}>{key.toUpperCase()}</Text>
                  <Switch value={value} onValueChange={() => toggleType(key as any)} trackColor={{ false: '#ddd', true: '#ff5722' }} />
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Severity</Text>
              {Object.entries(filters.severities).map(([key, value]) => (
                <View key={key} style={styles.filterRow}>
                  <Text style={[styles.filterLabel, key === 'high' && { color: '#d32f2f' }, key === 'medium' && { color: '#ff9800' }, key === 'low' && { color: '#4caf50' }]}>{key.toUpperCase()}</Text>
                  <Switch value={value} onValueChange={() => toggleSeverity(key as any)} trackColor={{ false: '#ddd', true: '#ff5722' }} />
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Text style={styles.resetBtnText}>Reset All Filters</Text>
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
    maxHeight: height * 0.8,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: verticalScale(10), marginBottom: verticalScale(16) },
  title: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#333' },
  closeBtn: { padding: scale(5) },
  closeText: { fontSize: moderateScale(22), fontWeight: 'bold', color: '#999' },
  section: { marginBottom: verticalScale(20) },
  sectionTitle: { fontSize: moderateScale(16), fontWeight: '600', marginBottom: verticalScale(12), color: '#555' },
  searchInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: scale(8), padding: scale(10), fontSize: moderateScale(16) },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: verticalScale(8), borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' },
  filterLabel: { fontSize: moderateScale(16), fontWeight: '500' },
  resetBtn: { backgroundColor: '#f0f0f0', paddingVertical: verticalScale(12), borderRadius: scale(8), alignItems: 'center', marginTop: verticalScale(10) },
  resetBtnText: { fontSize: moderateScale(16), color: '#d32f2f', fontWeight: '600' },
});