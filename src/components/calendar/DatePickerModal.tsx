import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { convertSolarToLunar, convertLunarToSolar, getFullDayData } from '../../core';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  initialDate = new Date(),
}) => {
  const [mode, setMode] = useState<'solarToLunar' | 'lunarToSolar'>('solarToLunar');
  const [day, setDay] = useState(initialDate.getDate().toString());
  const [month, setMonth] = useState((initialDate.getMonth() + 1).toString());
  const [year, setYear] = useState(initialDate.getFullYear().toString());
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  // Tính toán kết quả realtime khi người dùng nhập
  const conversionResult = useMemo(() => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2199) {
      return null;
    }

    try {
      if (mode === 'solarToLunar') {
        const lunar = convertSolarToLunar(d, m, y);
        const full = getFullDayData(new Date(y, m - 1, d));
        return {
          targetDate: new Date(y, m - 1, d),
          primaryLabel: `ÂM LỊCH: Ngày ${lunar.day} tháng ${lunar.month} ${lunar.isLeapMonth ? '(Nhuận)' : ''}`,
          secondaryLabel: `Năm ${full.canChi.yearCanChi} • Ngày ${full.canChi.dayCanChi}`,
          isZodiac: full.fengShui.isZodiacDay,
          zodiacLabel: full.fengShui.isZodiacDay ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo',
          solarTerm: full.fengShui.solarTerm,
        };
      } else {
        const solar = convertLunarToSolar(d, m, y, isLeapMonth);
        const target = new Date(solar.year, solar.month - 1, solar.day);
        const full = getFullDayData(target);
        return {
          targetDate: target,
          primaryLabel: `DƯƠNG LỊCH: ${full.solar.dayOfWeek}, ${solar.day}/${solar.month}/${solar.year}`,
          secondaryLabel: `Năm ${full.canChi.yearCanChi} • Ngày ${full.canChi.dayCanChi}`,
          isZodiac: full.fengShui.isZodiacDay,
          zodiacLabel: full.fengShui.isZodiacDay ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo',
          solarTerm: full.fengShui.solarTerm,
        };
      }
    } catch {
      return null;
    }
  }, [mode, day, month, year, isLeapMonth]);

  const handleApply = () => {
    if (conversionResult?.targetDate) {
      onSelectDate(conversionResult.targetDate);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleGroup}>
              <Ionicons name="swap-horizontal" size={20} color={Colors.cinnabar} />
              <Text style={styles.modalTitle}>BỘ ĐỔI NGÀY ÂM DƯƠNG</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Tab chọn chiều chuyển đổi */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setMode('solarToLunar')}
              style={[styles.toggleBtn, mode === 'solarToLunar' && styles.toggleBtnActive]}
            >
              <View style={styles.toggleContentRow}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    mode === 'solarToLunar' && styles.toggleBtnTextActive,
                  ]}
                >
                  Dương
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={mode === 'solarToLunar' ? '#FFFFFF' : Colors.light.textSecondary}
                  style={{ marginHorizontal: 4 }}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    mode === 'solarToLunar' && styles.toggleBtnTextActive,
                  ]}
                >
                  Âm
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('lunarToSolar')}
              style={[styles.toggleBtn, mode === 'lunarToSolar' && styles.toggleBtnActive]}
            >
              <View style={styles.toggleContentRow}>
                <Text
                  style={[
                    styles.toggleBtnText,
                    mode === 'lunarToSolar' && styles.toggleBtnTextActive,
                  ]}
                >
                  Âm
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={12}
                  color={mode === 'lunarToSolar' ? '#FFFFFF' : Colors.light.textSecondary}
                  style={{ marginHorizontal: 4 }}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    mode === 'lunarToSolar' && styles.toggleBtnTextActive,
                  ]}
                >
                  Dương
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Ô nhập ngày tháng năm */}
          <View style={styles.inputSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ngày</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={2}
                value={day}
                onChangeText={setDay}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tháng</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={2}
                value={month}
                onChangeText={setMonth}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1.4 }]}>
              <Text style={styles.inputLabel}>Năm</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                maxLength={4}
                value={year}
                onChangeText={setYear}
              />
            </View>
          </View>

          {mode === 'lunarToSolar' && (
            <TouchableOpacity
              style={styles.leapCheckboxRow}
              onPress={() => setIsLeapMonth(!isLeapMonth)}
            >
              <Ionicons
                name={isLeapMonth ? 'checkbox' : 'square-outline'}
                size={18}
                color={Colors.cinnabar}
              />
              <Text style={styles.leapText}>Là tháng nhuận âm lịch</Text>
            </TouchableOpacity>
          )}

          {/* Thẻ Kết Quả Realtime (< 2 taps) */}
          {conversionResult ? (
            <View style={styles.resultBox}>
              <Text style={styles.resultPrimary}>{conversionResult.primaryLabel}</Text>
              <Text style={styles.resultSecondary}>{conversionResult.secondaryLabel}</Text>
              <View style={styles.resultTags}>
                <View style={styles.resultZodiacBadge}>
                  {conversionResult.isZodiac && (
                    <Ionicons name="star" size={10} color="#8C6D1F" style={{ marginRight: 3 }} />
                  )}
                  <Text style={styles.resultZodiac}>{conversionResult.zodiacLabel}</Text>
                </View>
                <Text style={styles.resultTerm}>Tiết {conversionResult.solarTerm}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>Vui lòng nhập ngày tháng hợp lệ</Text>
            </View>
          )}

          {/* Nút Xem Ngày */}
          <TouchableOpacity
            style={[styles.applyButton, !conversionResult && styles.applyButtonDisabled]}
            disabled={!conversionResult}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Xem Tờ Lịch Ngày Này</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  modalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F3EFE6',
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.md,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  toggleBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  toggleBtnTextActive: {
    color: Colors.cinnabar,
    fontWeight: '800',
  },
  inputSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.light.textPrimary,
    backgroundColor: '#FAF8F5',
  },
  leapCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  leapText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
  },
  resultBox: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
    borderColor: '#E8D5A0',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  resultPrimary: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.cinnabar,
    marginBottom: 3,
  },
  resultSecondary: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  toggleContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultZodiacBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  resultZodiac: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  resultTerm: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#C62828',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: Colors.cinnabar,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  applyButtonDisabled: {
    opacity: 0.5,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
