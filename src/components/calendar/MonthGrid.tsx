import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { convertSolarToLunar, getDayCanChi, getDayZodiacStatus, getHoliday } from '../../core';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';
import { AnniversaryDisplayInfo } from '../../core/types/event.types';

interface MonthGridProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  anniversaries?: AnniversaryDisplayInfo[];
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export const MonthGrid: React.FC<MonthGridProps> = ({
  currentDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  anniversaries = [],
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Ngày đầu tiên của tháng và số ngày trong tháng
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Thứ của ngày 1 (Chuyển sang T2 = 0 ... CN = 6)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  // Xây dựng ma trận các ngày
  const cells: {
    day: number;
    solarDate: Date;
    lunarDay: number;
    lunarMonth: number;
    isZodiac: boolean;
    isSpecialLunar: boolean; // Rằm hoặc Mùng 1
    hasAnniversary: boolean;
    anniversaryTitle?: string;
    hasHoliday: boolean;
    holidayTitle?: string;
    isSelected: boolean;
    isToday: boolean;
  }[] = [];

  const today = new Date();

  for (let i = 1; i <= daysInMonth; i++) {
    const sDate = new Date(year, month, i);
    const lunar = convertSolarToLunar(i, month + 1, year);
    const dayCC = getDayCanChi(i, month + 1, year);
    const zodiac = getDayZodiacStatus(lunar.month, dayCC.chiIndex);
    const holiday = getHoliday(i, month + 1, lunar.day, lunar.month);
    const hasHoliday = !!holiday && !holiday.includes('Mùng Một') && !holiday.includes('Rằm');

    const anniversaryItem = anniversaries.find(
      (a) => a.lunarDay === lunar.day && a.lunarMonth === lunar.month
    );

    const isSelected =
      currentDate.getDate() === i &&
      currentDate.getMonth() === month &&
      currentDate.getFullYear() === year;

    const isToday =
      today.getDate() === i &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    cells.push({
      day: i,
      solarDate: sDate,
      lunarDay: lunar.day,
      lunarMonth: lunar.month,
      isZodiac: zodiac.isZodiac,
      isSpecialLunar: lunar.day === 1 || lunar.day === 15,
      hasAnniversary: !!anniversaryItem,
      anniversaryTitle: anniversaryItem?.title,
      hasHoliday,
      holidayTitle: hasHoliday ? holiday : undefined,
      isSelected,
      isToday,
    });
  }

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevMonth} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color={Colors.cinnabar} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerMonthText}>
            THÁNG {month + 1} NĂM {year}
          </Text>
        </View>

        <TouchableOpacity onPress={onNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color={Colors.cinnabar} />
        </TouchableOpacity>
      </View>

      {/* Weekday Names Header */}
      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((w, idx) => (
          <Text
            key={w}
            style={[
              styles.weekdayText,
              idx === 6 && styles.sundayText,
            ]}
          >
            {w}
          </Text>
        ))}
      </View>

      {/* Grid of Days */}
      <View style={styles.grid}>
        {/* Empty placeholder cells for previous month padding */}
        {Array.from({ length: startDayOfWeek }).map((_, idx) => (
          <View key={`empty-${idx}`} style={styles.emptyCell} />
        ))}

        {/* Day Cells */}
        {cells.map((cell) => {
          return (
            <TouchableOpacity
              key={`day-${cell.day}`}
              activeOpacity={0.7}
              onPress={() => onSelectDate(cell.solarDate)}
              style={[
                styles.cell,
                cell.hasAnniversary && !cell.isSelected && styles.cellAnniversary,
                cell.isSelected && styles.cellSelected,
                cell.isToday && !cell.isSelected && styles.cellToday,
              ]}
            >
              <View style={styles.cellTopRow}>
                <Text
                  style={[
                    styles.solarDayNumber,
                    cell.hasHoliday && !cell.isSelected && styles.textHoliday,
                    cell.isSelected && styles.textSelected,
                    cell.isToday && !cell.isSelected && styles.textToday,
                  ]}
                >
                  {cell.day}
                </Text>
                {cell.hasAnniversary && (
                  <Ionicons
                    name="flame"
                    size={8}
                    color={cell.isSelected ? '#FFFFFF' : '#D97706'}
                    style={styles.cellFlameIcon}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.lunarDayNumber,
                  cell.isSpecialLunar && styles.lunarSpecialText,
                  cell.isSelected && styles.textSelected,
                ]}
              >
                {cell.lunarDay === 1 ? `${cell.lunarDay}/${cell.lunarMonth}` : cell.lunarDay}
              </Text>

              {/* Dấu chấm Hoàng đạo, Rằm/Mùng 1, Lễ & Ngày Giỗ */}
              <View style={styles.dotRow}>
                {cell.isZodiac && (
                  <View style={[styles.zodiacDot, cell.isSelected && styles.dotSelected]} />
                )}
                {cell.isSpecialLunar && (
                  <View style={[styles.specialDot, cell.isSelected && styles.dotSelected]} />
                )}
                {cell.hasHoliday && (
                  <View style={[styles.holidayDot, cell.isSelected && styles.dotSelected]} />
                )}
                {cell.hasAnniversary && (
                  <View style={[styles.anniversaryDot, cell.isSelected && styles.dotSelected]} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Legend Footer */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={styles.zodiacDot} />
          <Text style={styles.legendText}>Hoàng Đạo</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.specialDot} />
          <Text style={styles.legendText}>Rằm / Mùng 1</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.holidayDot} />
          <Text style={[styles.legendText, { color: '#B91C1C', fontWeight: '700' }]}>Ngày Lễ</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.anniversaryDot} />
          <Text style={[styles.legendText, { color: '#B45309', fontWeight: '700' }]}>Ngày Giỗ</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  navButton: {
    padding: 6,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerMonthText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: 6,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  sundayText: {
    color: Colors.cinnabar,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyCell: {
    width: '14.28%',
    height: 48,
  },
  cell: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.sm,
    paddingVertical: 2,
  },
  cellSelected: {
    backgroundColor: Colors.cinnabar,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: Colors.cinnabar,
    backgroundColor: '#FFF5F5',
  },
  cellAnniversary: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  cellTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFlameIcon: {
    marginLeft: 2,
  },
  solarDayNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
  },
  lunarDayNumber: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.light.textTertiary,
    marginTop: 1,
  },
  lunarSpecialText: {
    color: Colors.cinnabar,
    fontWeight: '800',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textToday: {
    color: Colors.cinnabar,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
    height: 4,
  },
  zodiacDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.gold,
  },
  specialDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.cinnabar,
  },
  holidayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DC2626',
  },
  textHoliday: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  anniversaryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D97706',
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingTop: Spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
});
