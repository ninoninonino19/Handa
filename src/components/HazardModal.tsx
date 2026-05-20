import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { HazardReport } from '../types/hazard';
import { getRecommendation } from '../utils/helpers';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  hazard: HazardReport | null;
  onClose: () => void;
}

export default function HazardModal({ visible, hazard, onClose }: Props) {
  if (!hazard) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{hazard.type.toUpperCase()} Hazard</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <Text style={styles.label}>Severity:</Text>
              <Text style={[styles.value, hazard.severity === 'high' && styles.high, hazard.severity === 'medium' && styles.medium, hazard.severity === 'low' && styles.low]}>
                {hazard.severity?.toUpperCase() || 'UNKNOWN'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Location:</Text>
              <Text style={styles.value}>{hazard.barangay || 'Not specified'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Reported:</Text>
              <Text style={styles.value}>{new Date(hazard.timestamp).toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.value}>{hazard.description}</Text>
            </View>
            <View style={styles.recommendBox}>
              <Text style={styles.recommendTitle}>Recommended Action</Text>
              <Text style={styles.recommendText}>{getRecommendation(hazard.severity)}</Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: {
    backgroundColor: 'white',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(30),
    maxHeight: height * 0.7,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: verticalScale(10), marginBottom: verticalScale(16) },
  title: { fontSize: moderateScale(20), fontWeight: 'bold', color: '#333' },
  closeBtn: { padding: scale(5) },
  closeText: { fontSize: moderateScale(22), fontWeight: 'bold', color: '#999' },
  row: { marginBottom: verticalScale(12) },
  label: { fontSize: moderateScale(14), fontWeight: '600', color: '#666', marginBottom: verticalScale(4) },
  value: { fontSize: moderateScale(16), color: '#333' },
  high: { color: '#d32f2f', fontWeight: 'bold' },
  medium: { color: '#ff9800', fontWeight: 'bold' },
  low: { color: '#4caf50', fontWeight: 'bold' },
  recommendBox: { backgroundColor: '#f0f4f8', padding: scale(15), borderRadius: scale(10), marginTop: verticalScale(10) },
  recommendTitle: { fontSize: moderateScale(16), fontWeight: 'bold', color: '#d32f2f', marginBottom: verticalScale(8) },
  recommendText: { fontSize: moderateScale(15), color: '#333', lineHeight: moderateScale(20) },
});