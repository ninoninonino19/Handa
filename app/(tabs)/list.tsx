import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl,
  TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHazards } from '../../src/context/HazardContext';
import { HazardReport } from '../../src/types/hazard';
import HazardModal from '../../src/components/HazardModal';
import FilterModal from '../../src/components/FilterModal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListScreen() {
  const insets = useSafeAreaInsets();
  const { filteredHazards, loading, refreshHazards, filters, setSearchText } = useHazards();
  const [selectedHazard, setSelectedHazard] = useState<HazardReport | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString();

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'high': return { text: 'HIGH', style: styles.badgeHigh };
      case 'medium': return { text: 'MEDIUM', style: styles.badgeMedium };
      case 'low': return { text: 'LOW', style: styles.badgeLow };
      default: return { text: 'UNKNOWN', style: styles.badgeUnknown };
    }
  };

  const renderItem = ({ item }: { item: HazardReport }) => {
    const badge = getSeverityBadge(item.severity);
    return (
      <TouchableOpacity style={styles.card} onPress={() => { setSelectedHazard(item); setModalVisible(true); }}>
        <View style={styles.cardHeader}>
          <Text style={styles.hazardType}>{item.type.toUpperCase()}</Text>
          <View style={[styles.badge, badge.style]}>
            <Text style={styles.badgeText}>{badge.text}</Text>
          </View>
        </View>
        <Text style={styles.barangay}>{item.barangay || 'Unknown location'}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </TouchableOpacity>
    );
  };

  const getEmptyMessage = () => {
    const noTypeSelected = Object.values(filters.types).every(v => !v);
    const noSeveritySelected = Object.values(filters.severities).every(v => !v);
    if (noTypeSelected && noSeveritySelected && !filters.searchText.trim()) {
      return "No hazards in the area";
    }
    if (noTypeSelected && noSeveritySelected && filters.searchText.trim()) {
      return "No hazards match your search";
    }
    return "No hazards match your current filters";
  };

  // Show active filter indicator only if at least one type or severity is selected
  const hasActiveFilters = Object.values(filters.types).some(v => v) || Object.values(filters.severities).some(v => v);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {hasActiveFilters && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>✔ Filters active</Text>
        </View>
      )}

      <FlatList
        data={filteredHazards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshHazards} />}
        ListEmptyComponent={!loading ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>{getEmptyMessage()}</Text>
          </View>
        ) : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search barangay or description"
            placeholderTextColor="#999"
            value={filters.searchText}
            onChangeText={setSearchText}
          />
          {filters.searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <HazardModal visible={modalVisible} hazard={selectedHazard} onClose={() => setModalVisible(false)} />
      <FilterModal visible={filterModalVisible} onClose={() => setFilterModalVisible(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  activeFilters: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeFiltersText: { fontSize: 13, color: '#495057', fontWeight: '500' },
  listContent: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 80 },
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyText: { textAlign: 'center', color: '#868e96', fontSize: 16, marginTop: 12 },
  card: {
    backgroundColor: 'white',
    marginVertical: 6,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' },
  hazardType: { fontSize: 18, fontWeight: '700', color: '#212529', flexShrink: 1 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginLeft: 8 },
  badgeHigh: { backgroundColor: '#ffebee' },
  badgeMedium: { backgroundColor: '#fff3e0' },
  badgeLow: { backgroundColor: '#e8f5e9' },
  badgeUnknown: { backgroundColor: '#e9ecef' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#495057' },
  barangay: { fontSize: 14, color: '#6c757d', marginBottom: 6 },
  description: { fontSize: 15, color: '#343a40', marginBottom: 8, lineHeight: 20 },
  timestamp: { fontSize: 12, color: '#adb5bd' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#212529' },
  filterButton: {
    backgroundColor: '#ff5722',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});