import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FullDayData } from '../../core/types/lunar.types';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { AnniversaryDisplayInfo } from '../../core/types/event.types';

interface DayBlockProps {
  data: FullDayData;
  anniversaries?: AnniversaryDisplayInfo[];
  onPressDate?: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export const DayBlock: React.FC<DayBlockProps> = ({
  data,
  anniversaries = [],
  onPressDate,
  onPrevDay,
  onNextDay,
  onToday,
}) => {
  const { solar, lunar, canChi, fengShui, quote } = data;

  return (
    <View style={styles.outerContainer}>
      {/* Khung tờ lịch xé cao cấp */}
      <View style={styles.tearOffBlock}>
        {/* Thanh nẹp lịch đỏ chu sa (Top Binding Header) */}
        <View style={styles.topBinding}>
          <View style={styles.bindingHoles}>
            <View style={styles.hole} />
            <View style={styles.hole} />
          </View>
          <View style={styles.bindingInfo}>
            <Text style={styles.bindingYearText}>
              NĂM {solar.year} • {canChi.yearCanChi.toUpperCase()}
            </Text>
            <Text style={styles.bindingSeasonText}>
              Tiết {fengShui.solarTerm}
            </Text>
          </View>
        </View>

        {/* Nội dung tờ lịch */}
        <View style={styles.paperContent}>
          {/* Header tờ lịch: Thứ & Tháng Dương lịch */}
          <View style={styles.paperHeader}>
            <TouchableOpacity onPress={onPrevDay} style={styles.navArrowButton}>
              <Ionicons name="chevron-back" size={22} color={Colors.cinnabar} />
            </TouchableOpacity>

            <View style={styles.solarHeaderCenter}>
              <Text style={styles.dayOfWeekText}>{solar.dayOfWeek.toUpperCase()}</Text>
              <Text style={styles.solarMonthYearText}>
                Tháng {solar.month} năm {solar.year}
              </Text>
            </View>

            <TouchableOpacity onPress={onNextDay} style={styles.navArrowButton}>
              <Ionicons name="chevron-forward" size={22} color={Colors.cinnabar} />
            </TouchableOpacity>
          </View>

          {/* Ngày Dương Lịch To Bản (Hero Central Number) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPressDate}
            style={styles.solarDayContainer}
          >
            <Text style={styles.solarDayText}>{solar.day}</Text>
          </TouchableOpacity>

          {/* Huy hiệu Ngày Hoàng Đạo */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.zodiacBadge,
                fengShui.isZodiacDay ? styles.zodiacGood : styles.zodiacNormal,
              ]}
            >
              {fengShui.isZodiacDay && (
                <Ionicons
                  name="star"
                  size={11}
                  color={Colors.status.zodiacText}
                  style={{ marginRight: 3 }}
                />
              )}
              <Text
                style={[
                  styles.zodiacBadgeText,
                  fengShui.isZodiacDay ? styles.zodiacGoodText : styles.zodiacNormalText,
                ]}
              >
                {fengShui.isZodiacDay ? 'NGÀY HOÀNG ĐẠO' : 'NGÀY HẮC ĐẠO'} • {fengShui.zodiacName}
              </Text>
            </View>
          </View>

          {/* Đường phân cách họa tiết trang nhã */}
          <View style={styles.ornamentDivider}>
            <View style={styles.line} />
            <Ionicons name="flower-outline" size={14} color={Colors.gold} style={{ marginHorizontal: 8 }} />
            <View style={styles.line} />
          </View>

          {/* Khối Ngày Âm Lịch (Trọng tâm văn hóa) */}
          <View style={styles.lunarContainer}>
            <View style={styles.lunarMain}>
              <Text style={styles.lunarDayNumber}>{lunar.day}</Text>
              <View style={styles.lunarDetails}>
                <Text
                  style={styles.lunarMonthName}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {lunar.monthName}
                </Text>
                <Text style={styles.lunarCanChiDay} numberOfLines={1}>
                  Ngày {canChi.dayCanChi}
                </Text>
              </View>
            </View>
            <View style={styles.lunarElementsBadge}>
              <Text style={styles.elementText} numberOfLines={1}>
                {canChi.element}
              </Text>
            </View>
          </View>

          {/* Danh ngôn / Lời dạy an yên dưới chân tờ lịch */}
          <View style={styles.quoteBox}>
            <Text style={styles.quoteSymbol}>“</Text>
            <Text style={styles.quoteText}>{quote.content}</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  tearOffBlock: {
    backgroundColor: Colors.light.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  topBinding: {
    backgroundColor: Colors.cinnabar,
    paddingVertical: 10,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: Colors.gold,
  },
  bindingHoles: {
    flexDirection: 'row',
    gap: 12,
  },
  hole: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#661418',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  bindingInfo: {
    alignItems: 'flex-end',
  },
  bindingYearText: {
    color: '#FFF6E0',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bindingSeasonText: {
    color: Colors.goldLight,
    fontSize: 10,
    fontWeight: '500',
  },
  paperContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: '#FCFAF6',
  },
  paperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: Spacing.xs,
  },
  navArrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solarHeaderCenter: {
    alignItems: 'center',
  },
  dayOfWeekText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 2,
  },
  solarMonthYearText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  solarDayContainer: {
    marginVertical: 0,
    alignItems: 'center',
  },
  solarDayText: {
    fontSize: 92,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    lineHeight: 102,
    fontFamily: 'serif',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  holidayBadge: {
    backgroundColor: Colors.cinnabar,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  holidayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  anniversaryBadge: {
    backgroundColor: '#D97706',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
  },
  anniversaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  zodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  zodiacBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  zodiacGood: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.gold,
  },
  zodiacGoodText: {
    color: Colors.status.zodiacText,
    fontSize: 11,
    fontWeight: '700',
  },
  zodiacNormal: {
    backgroundColor: '#EDF2F7',
    borderColor: '#CBD5E0',
  },
  zodiacNormalText: {
    color: '#4A5568',
    fontSize: 11,
    fontWeight: '600',
  },
  ornamentDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  lunarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginTop: Spacing.xs,
  },
  lunarMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  lunarDayNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.cinnabar,
    fontFamily: 'serif',
    marginRight: 10,
    minWidth: 40,
  },
  lunarDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  lunarMonthName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  lunarCanChiDay: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  lunarElementsBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    borderWidth: 0.8,
    borderColor: Colors.goldLight,
    flexShrink: 0,
  },
  elementText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8C6D1F',
  },
  quoteBox: {
    marginTop: Spacing.md,
    backgroundColor: 'rgba(243, 239, 230, 0.6)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    width: '100%',
    position: 'relative',
  },
  quoteSymbol: {
    position: 'absolute',
    top: -4,
    left: 8,
    fontSize: 24,
    color: Colors.gold,
    opacity: 0.5,
  },
  quoteText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  quoteAuthor: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.cinnabar,
    textAlign: 'right',
    marginTop: 4,
  },
});
