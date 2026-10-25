import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { convertLunarToSolar, getLunarMonthName } from '../../core';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface AddAnniversaryModalProps {
  visible: boolean;
  initialLunarDay?: number;
  initialLunarMonth?: number;
  onClose: () => void;
  onSave: (data: {
    title: string;
    personName?: string;
    lunarDay: number;
    lunarMonth: number;
    remindDaysBefore: number;
    notes?: string;
  }) => void;
}

export const AddAnniversaryModal: React.FC<AddAnniversaryModalProps> = ({
  visible,
  initialLunarDay,
  initialLunarMonth,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [personName, setPersonName] = useState('');
  const [lunarDay, setLunarDay] = useState(initialLunarDay || 15);
  const [lunarMonth, setLunarMonth] = useState(initialLunarMonth || 8);
  const [remindDaysBefore, setRemindDaysBefore] = useState(3);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Quản lý bàn phím và cuộn mượt mà
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const windowHeight = Dimensions.get('window').height;
  const dynamicCardMaxHeight = keyboardVisible
    ? Math.max(280, windowHeight - keyboardHeight - (Platform.OS === 'android' ? 40 : 60))
    : '88%';

  // Dự báo ngày dương tương ứng realtime
  const previewSolar = useMemo(() => {
    try {
      const currentYear = new Date().getFullYear();
      let solar = convertLunarToSolar(lunarDay, lunarMonth, currentYear);
      let target = new Date(solar.year, solar.month - 1, solar.day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (target.getTime() < today.getTime()) {
        solar = convertLunarToSolar(lunarDay, lunarMonth, currentYear + 1);
        target = new Date(solar.year, solar.month - 1, solar.day);
      }

      const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const dayStr = target.getDate().toString().padStart(2, '0');
      const monthStr = (target.getMonth() + 1).toString().padStart(2, '0');

      return {
        dateString: `${dayStr}/${monthStr}/${target.getFullYear()}`,
        diff,
      };
    } catch {
      return null;
    }
  }, [lunarDay, lunarMonth]);

  const handleSave = () => {
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên lễ giỗ');
      return;
    }
    setErrorMsg('');
    onSave({
      title: title.trim(),
      personName: personName.trim() || undefined,
      lunarDay,
      lunarMonth,
      remindDaysBefore,
      notes: notes.trim() || undefined,
    });
    // Reset form
    setTitle('');
    setPersonName('');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={[
              styles.overlay,
              keyboardVisible && {
                justifyContent: 'flex-start',
                paddingTop: Platform.OS === 'android' ? 24 : 44,
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={[styles.modalCard, { maxHeight: dynamicCardMaxHeight }]}>
                {/* Header */}
                <View style={styles.modalHeader}>
                  <View style={styles.titleGroup}>
                    <Ionicons name="bookmark" size={20} color={Colors.cinnabar} />
                    <Text style={styles.modalTitle}>THÊM LỄ GIỖ GIA TIÊN</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {keyboardVisible && (
                      <TouchableOpacity
                        style={styles.doneKeyboardBtn}
                        onPress={Keyboard.dismiss}
                      >
                        <Ionicons name="checkmark-done" size={15} color={Colors.cinnabar} />
                        <Text style={styles.doneKeyboardText}>Xong</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                      <Ionicons name="close" size={22} color={Colors.light.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView
                  ref={scrollViewRef}
                  style={styles.scrollArea}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: Spacing.sm }}
                >
                  {/* Tên lễ giỗ */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                      Tên Lễ Giỗ <Text style={{ color: Colors.cinnabar }}>*</Text>
                    </Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ví dụ: Giỗ Cụ Cố Nội, Giỗ Mẹ, Giỗ Bác Hai..."
                      placeholderTextColor={Colors.light.textTertiary}
                      value={title}
                      returnKeyType="next"
                      onChangeText={(t) => {
                        setTitle(t);
                        if (errorMsg) setErrorMsg('');
                      }}
                    />
                  </View>

                  {/* Tên người quá cố */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Tên Người Quá Cố (Tùy chọn)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Ví dụ: Cụ Phạm Văn An"
                      placeholderTextColor={Colors.light.textTertiary}
                      value={personName}
                      returnKeyType="next"
                      onChangeText={setPersonName}
                    />
                  </View>

                  {/* Chọn Ngày Âm Lịch (Ngày & Tháng) */}
                  <Text style={styles.fieldLabel}>Ngày Mất Theo Âm Lịch</Text>
                  <View style={styles.lunarPickerRow}>
                    {/* Ngày */}
                    <View style={styles.pickerBox}>
                      <Text style={styles.pickerSubLabel}>Ngày (1 - 30)</Text>
                      <View style={styles.stepperRow}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setLunarDay((d) => (d > 1 ? d - 1 : 30))}
                        >
                          <Ionicons name="remove" size={18} color={Colors.cinnabar} />
                        </TouchableOpacity>
                        <Text style={styles.stepValue}>{lunarDay}</Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setLunarDay((d) => (d < 30 ? d + 1 : 1))}
                        >
                          <Ionicons name="add" size={18} color={Colors.cinnabar} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Tháng */}
                    <View style={[styles.pickerBox, { flex: 1.2 }]}>
                      <Text style={styles.pickerSubLabel}>Tháng Âm Lịch</Text>
                      <View style={styles.stepperRow}>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setLunarMonth((m) => (m > 1 ? m - 1 : 12))}
                        >
                          <Ionicons name="remove" size={18} color={Colors.cinnabar} />
                        </TouchableOpacity>
                        <Text style={styles.stepValueMonth}>
                          {getLunarMonthName(lunarMonth).replace('Tháng ', 'Th. ')}
                        </Text>
                        <TouchableOpacity
                          style={styles.stepBtn}
                          onPress={() => setLunarMonth((m) => (m < 12 ? m + 1 : 1))}
                        >
                          <Ionicons name="add" size={18} color={Colors.cinnabar} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Realtime Converted Solar Date Preview */}
                  {previewSolar && (
                    <View style={styles.previewBox}>
                      <Ionicons name="calendar-outline" size={18} color="#8C6D1F" />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.previewTitle}>Quy đổi sang Dương lịch:</Text>
                        <Text style={styles.previewDate}>
                          Ngày {previewSolar.dateString} (Còn {previewSolar.diff} ngày nữa)
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Nhắc nhở trước bao nhiêu ngày */}
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Thông Báo Nhắc Nhở Sắm Lễ (07:00 Sáng)</Text>
                    <View style={styles.reminderRow}>
                      {[1, 3, 7].map((days) => (
                        <TouchableOpacity
                          key={days}
                          style={[
                            styles.remindPill,
                            remindDaysBefore === days && styles.remindPillActive,
                          ]}
                          onPress={() => setRemindDaysBefore(days)}
                        >
                          <Text
                            style={[
                              styles.remindPillText,
                              remindDaysBefore === days && styles.remindPillTextActive,
                            ]}
                          >
                            Trước {days} ngày (07h)
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* Ghi chú mâm cỗ */}
                  <View style={styles.fieldGroup}>
                    <View style={styles.fieldLabelRow}>
                      <Text style={styles.fieldLabel}>Ghi Chú Chuẩn Bị & Lễ Vật</Text>
                      {keyboardVisible && (
                        <TouchableOpacity onPress={Keyboard.dismiss}>
                          <Text style={styles.dismissInlineText}>Thu gọn bàn phím ✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      placeholder="Ví dụ: Đặt cỗ mặn, hoa huệ trắng, quả thanh long, mời anh em họ hàng..."
                      placeholderTextColor={Colors.light.textTertiary}
                      multiline
                      numberOfLines={3}
                      value={notes}
                      onChangeText={setNotes}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 120);
                      }}
                    />
                  </View>

                  {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
                </ScrollView>

                {/* Buttons Footer */}
                <View style={styles.footerRow}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                    <Text style={styles.cancelBtnText}>Hủy Bỏ</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.saveBtnText}>Lưu Ngày Giỗ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    maxHeight: '90%',
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.md,
  },
  titleGroup: {
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
  doneKeyboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDECEF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  doneKeyboardText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
  closeBtn: {
    padding: 4,
  },
  scrollArea: {
    flexShrink: 1,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dismissInlineText: {
    fontSize: 11,
    color: Colors.cinnabar,
    fontWeight: '600',
  },
  fieldGroup: {
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1.2,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.light.textPrimary,
    backgroundColor: '#FAF8F5',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  lunarPickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: Spacing.md,
  },
  pickerBox: {
    flex: 1,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.2,
    borderColor: Colors.light.border,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  pickerSubLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.cinnabar,
    minWidth: 26,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  stepValueMonth: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.cinnabar,
    minWidth: 50,
    textAlign: 'center',
  },
  previewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldSoft,
    borderWidth: 1,
    borderColor: '#E8D5A0',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewTitle: {
    fontSize: 11,
    color: '#8C6D1F',
    fontWeight: '600',
  },
  previewDate: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cinnabar,
    marginTop: 2,
  },
  reminderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  remindPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.sm,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.2,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  remindPillActive: {
    backgroundColor: Colors.cinnabar,
    borderColor: Colors.cinnabar,
  },
  remindPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  remindPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    color: '#C62828',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: Radius.md,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  saveBtn: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: Radius.md,
    backgroundColor: Colors.cinnabar,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
