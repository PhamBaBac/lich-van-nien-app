import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DayFengShui, CanChiDate } from '../../core/types/lunar.types';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface BentoCardsProps {
  fengShui: DayFengShui;
  canChi: CanChiDate;
}

export const BentoCards: React.FC<BentoCardsProps> = ({ fengShui, canChi }) => {
  return (
    <View style={styles.container}>
      {/* Card 1: Việc Nên Làm & Việc Kiêng Cữ */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.headerTitleGroup}>
            <Ionicons name="checkbox-outline" size={17} color={Colors.cinnabar} />
            <Text style={styles.cardTitle}>VIỆC NÊN LÀM & KIÊNG CỮ</Text>
          </View>
          <Text style={styles.dutyTag}>Trực {fengShui.duty}</Text>
        </View>

        <View style={styles.adviceRow}>
          {/* Cột Nên */}
          <View style={styles.adviceColumn}>
            <View style={styles.tagHeaderGood}>
              <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
              <Text style={styles.tagTextGood}>NÊN LÀM</Text>
            </View>
            <View style={styles.itemsList}>
              {fengShui.suitable.map((item, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Ionicons name="checkmark" size={13} color="#2E7D32" style={{ marginRight: 4, marginTop: 2 }} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Đường ngăn giữa */}
          <View style={styles.verticalDivider} />

          {/* Cột Kiêng */}
          <View style={styles.adviceColumn}>
            <View style={styles.tagHeaderBad}>
              <Ionicons name="close-circle" size={14} color="#C62828" />
              <Text style={styles.tagTextBad}>KIÊNG CỮ</Text>
            </View>
            <View style={styles.itemsList}>
              {fengShui.unsuitable.map((item, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Ionicons name="close" size={13} color="#C62828" style={{ marginRight: 4, marginTop: 2 }} />
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.dutyDescBox}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
            <Ionicons name="bulb-outline" size={15} color="#8C6D1F" style={{ marginTop: 2 }} />
            <Text style={styles.dutyDescText}>
              <Text style={{ fontWeight: '700' }}>Lời khuyên Trực {fengShui.duty}:</Text>{' '}
              {fengShui.dutyDescription}
            </Text>
          </View>
        </View>
      </View>

      {/* Grid 2 Cột: Hướng Xuất Hành & Thông Số Ngày */}
      <View style={styles.twoColumnRow}>
        {/* Hướng Xuất Hành */}
        <View style={[styles.card, styles.columnCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="compass-outline" size={16} color={Colors.cinnabar} />
              <Text style={styles.cardTitle}>XUẤT HÀNH</Text>
            </View>
          </View>

          <View style={styles.directionItem}>
            <Text style={styles.directionLabel}>Hỷ Thần:</Text>
            <Text style={styles.directionValue}>{fengShui.directions.joyGod}</Text>
          </View>

          <View style={styles.directionItem}>
            <Text style={styles.directionLabel}>Tài Thần:</Text>
            <Text style={styles.directionValue}>{fengShui.directions.wealthGod}</Text>
          </View>
        </View>

        {/* Sao Chiếu & Tiết Khí */}
        <View style={[styles.card, styles.columnCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerTitleGroup}>
              <Ionicons name="star-outline" size={16} color={Colors.gold} />
              <Text style={styles.cardTitle}>SAO & TIẾT KHÍ</Text>
            </View>
          </View>

          <View style={styles.directionItem}>
            <Text style={styles.directionLabel}>Sao chiếu:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text
                style={[
                  styles.directionValue,
                  { color: fengShui.starQuality === 'good' ? '#2E7D32' : Colors.light.textPrimary },
                ]}
              >
                {fengShui.star}
              </Text>
              {fengShui.starQuality === 'good' && (
                <Ionicons name="star" size={11} color={Colors.gold} />
              )}
            </View>
          </View>

          <View style={styles.directionItem}>
            <Text style={styles.directionLabel}>Tiết khí:</Text>
            <Text style={styles.directionValue}>{fengShui.solarTerm}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: Spacing.xs,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 0.5,
  },
  dutyTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  adviceRow: {
    flexDirection: 'row',
    marginTop: Spacing.xs,
  },
  adviceColumn: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: Colors.light.divider,
    marginHorizontal: Spacing.md,
  },
  tagHeaderGood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  tagTextGood: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2E7D32',
  },
  tagHeaderBad: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  tagTextBad: {
    fontSize: 11,
    fontWeight: '800',
    color: '#C62828',
  },
  itemsList: {
    gap: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDotGood: {
    color: '#2E7D32',
    fontSize: 13,
    marginRight: 4,
    lineHeight: 16,
  },
  bulletDotBad: {
    color: '#C62828',
    fontSize: 13,
    marginRight: 4,
    lineHeight: 16,
  },
  bulletText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
    lineHeight: 17,
    flex: 1,
  },
  dutyDescBox: {
    marginTop: Spacing.sm,
    backgroundColor: '#F9F7F2',
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  dutyDescText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  columnCard: {
    flex: 1,
  },
  directionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  directionLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  directionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
});
