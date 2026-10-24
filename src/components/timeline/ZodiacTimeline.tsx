import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ZodiacHour } from '../../core/types/lunar.types';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface ZodiacTimelineProps {
  hours: ZodiacHour[];
  currentHour?: number;
}

export const ZodiacTimeline: React.FC<ZodiacTimelineProps> = ({
  hours,
  currentHour = new Date().getHours(),
}) => {
  const currentBranchIndex = Math.floor((currentHour + 1) / 2) % 12;
  const [selectedHour, setSelectedHour] = useState<ZodiacHour>(
    hours[currentBranchIndex] || hours[0]
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="time-outline" size={18} color={Colors.cinnabar} />
          <Text style={styles.titleText}>GIỜ HOÀNG ĐẠO TRONG NGÀY</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Text style={styles.subtext}>6 giờ Hoàng Đạo</Text>
          <Ionicons name="star" size={11} color={Colors.gold} />
        </View>
      </View>

      {/* Horizontal Scroll of 12 Can Chi Hours */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hours.map((item, index) => {
          const isSelected = selectedHour.branch === item.branch;
          const isNow = index === currentBranchIndex;

          return (
            <TouchableOpacity
              key={item.branch}
              activeOpacity={0.8}
              onPress={() => setSelectedHour(item)}
              style={[
                styles.hourCard,
                item.isZodiac ? styles.zodiacCard : styles.blackCard,
                isSelected && styles.selectedCard,
              ]}
            >
              {isNow && (
                <View style={styles.nowBadge}>
                  <Text style={styles.nowBadgeText}>Hiện tại</Text>
                </View>
              )}

              <View style={styles.branchRow}>
                <Text
                  style={[
                    styles.branchText,
                    item.isZodiac ? styles.zodiacText : styles.blackText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {item.branch}
                </Text>
                {item.isZodiac && (
                  <Ionicons name="star" size={10} color={Colors.gold} />
                )}
              </View>

              <Text style={styles.timeRangeText}>{item.solarTime.split(' - ')[0]}</Text>
              <Text style={[styles.statusTag, item.isZodiac ? styles.tagGood : styles.tagNormal]}>
                {item.isZodiac ? 'Hoàng đạo' : 'Hắc đạo'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Hour Details Box */}
      {selectedHour && (
        <View style={styles.detailsBox}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailTitle}>
              Giờ {selectedHour.branch} ({selectedHour.solarTime})
            </Text>
            <View
              style={[
                styles.detailStatusBadge,
                selectedHour.isZodiac ? styles.badgeGood : styles.badgeNormal,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                {selectedHour.isZodiac && (
                  <Ionicons name="star" size={11} color={Colors.gold} />
                )}
                <Text
                  style={[
                    styles.detailStatusText,
                    selectedHour.isZodiac ? styles.textGood : styles.textNormal,
                  ]}
                >
                  {selectedHour.isZodiac ? 'Khung Giờ Cát Lành' : 'Khung Giờ Bình Hòa / Hắc Đạo'}
                </Text>
              </View>
            </View>
          </View>
          <Text style={styles.detailDesc}>{selectedHour.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 11,
    color: Colors.goldDark,
    fontWeight: '600',
  },
  scrollContent: {
    paddingVertical: 4,
    gap: 10,
  },
  hourCard: {
    width: 82,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.2,
    borderColor: Colors.light.border,
    position: 'relative',
  },
  zodiacCard: {
    backgroundColor: '#FFFDF9',
    borderColor: '#E8D5A0',
  },
  blackCard: {
    backgroundColor: '#F7F7F7',
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    borderColor: Colors.cinnabar,
    backgroundColor: '#FFF5F5',
    borderWidth: 1.8,
  },
  nowBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: Colors.cinnabar,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  nowBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  branchText: {
    fontSize: 15,
    fontWeight: '800',
  },
  starIcon: {
    color: Colors.gold,
    fontSize: 11,
  },
  zodiacText: {
    color: Colors.cinnabar,
  },
  blackText: {
    color: Colors.light.textSecondary,
  },
  selectedText: {
    color: Colors.cinnabar,
  },
  timeRangeText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginVertical: 4,
    fontWeight: '500',
  },
  statusTag: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  tagGood: {
    backgroundColor: Colors.goldSoft,
    color: '#8C6D1F',
  },
  tagNormal: {
    backgroundColor: '#EDF2F7',
    color: '#718096',
  },
  detailsBox: {
    marginTop: Spacing.sm,
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  detailStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeGood: {
    backgroundColor: Colors.goldSoft,
  },
  badgeNormal: {
    backgroundColor: '#EDF2F7',
  },
  detailStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  textGood: {
    color: '#8C6D1F',
  },
  textNormal: {
    color: '#4A5568',
  },
  detailDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
});
