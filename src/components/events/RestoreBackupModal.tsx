import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface RestoreBackupModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'merge' | 'replace') => void;
  currentCount?: number;
}

export const RestoreBackupModal: React.FC<RestoreBackupModalProps> = ({
  visible,
  onClose,
  onSelectMode,
  currentCount = 0,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Nút đóng nhanh góc trên phải */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          {/* Biểu tượng đám mây tải về */}
          <View style={styles.iconCircle}>
            <Ionicons name="cloud-download" size={30} color={Colors.cinnabar} />
          </View>

          {/* Tiêu đề & Giới thiệu */}
          <Text style={styles.titleText}>KHÔI PHỤC SỔ GIỖ</Text>
          <Text style={styles.subtitleText}>
            Chọn phương thức nạp dữ liệu từ tệp tin đã sao lưu (trên Google Drive, Zalo, Tệp máy)
          </Text>

          {currentCount > 0 ? (
            <View style={styles.countPill}>
              <Ionicons name="bookmark-outline" size={13} color="#8C6D1F" />
              <Text style={styles.countPillText}>
                Hiện có trong máy: <Text style={{ fontWeight: '800' }}>{currentCount}</Text> ngày giỗ
              </Text>
            </View>
          ) : null}

          {/* Lựa chọn 1: Gộp thêm (Khuyên dùng) */}
          <TouchableOpacity
            style={[styles.optionCard, styles.optionCardRecommended]}
            activeOpacity={0.75}
            onPress={() => onSelectMode('merge')}
          >
            <View style={styles.optionTopRow}>
              <View style={[styles.optionIconBox, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="copy-outline" size={20} color="#2E7D32" />
              </View>
              <View style={styles.optionTitleCol}>
                <View style={styles.optionHeaderRow}>
                  <Text style={styles.optionTitle}>Gộp Thêm Dữ Liệu</Text>
                  <View style={styles.recommendedBadge}>
                    <Text style={styles.recommendedBadgeText}>KHUYÊN DÙNG</Text>
                  </View>
                </View>
                <Text style={styles.optionDesc}>
                  Giữ nguyên các ngày giỗ đang có, chỉ nạp thêm ngày mới từ tệp và tự động lọc chống trùng lặp.
                </Text>
              </View>
            </View>
            <View style={styles.optionActionRow}>
              <Text style={styles.optionActionTextGood}>Chọn tệp để Gộp thêm</Text>
              <Ionicons name="chevron-forward" size={14} color="#2E7D32" />
            </View>
          </TouchableOpacity>

          {/* Lựa chọn 2: Ghi đè toàn bộ */}
          <TouchableOpacity
            style={styles.optionCard}
            activeOpacity={0.75}
            onPress={() => onSelectMode('replace')}
          >
            <View style={styles.optionTopRow}>
              <View style={[styles.optionIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="refresh-outline" size={20} color="#E65100" />
              </View>
              <View style={styles.optionTitleCol}>
                <View style={styles.optionHeaderRow}>
                  <Text style={styles.optionTitle}>Ghi Đè Toàn Bộ</Text>
                  <View style={styles.replaceBadge}>
                    <Text style={styles.replaceBadgeText}>THAY THẾ</Text>
                  </View>
                </View>
                <Text style={styles.optionDesc}>
                  Xóa các ngày giỗ hiện tại trên máy và thay thế hoàn toàn bằng danh sách trong tệp sao lưu.
                </Text>
              </View>
            </View>
            <View style={styles.optionActionRow}>
              <Text style={styles.optionActionTextWarning}>Chọn tệp để Ghi đè</Text>
              <Ionicons name="chevron-forward" size={14} color="#E65100" />
            </View>
          </TouchableOpacity>

          {/* Hộp mẹo nhỏ */}
          <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={15} color="#8C6D1F" style={{ marginTop: 1 }} />
            <Text style={styles.tipText}>
              Bạn có thể chọn tệp tin <Text style={{ fontWeight: '700' }}>.json</Text> đã lưu trên Google Drive, thư mục Tải về hoặc tệp vừa nhận qua Zalo.
            </Text>
          </View>

          {/* Nút Hủy */}
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    padding: 6,
    zIndex: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FBECEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F6D2D0',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.cinnabar,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: Spacing.sm,
    paddingHorizontal: 8,
  },
  countPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDF8EC',
    borderWidth: 1,
    borderColor: '#E8D5A0',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  countPillText: {
    fontSize: 11,
    color: '#8C6D1F',
  },
  optionCard: {
    width: '100%',
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E2DACB',
    borderRadius: Radius.lg,
    padding: 12,
    marginBottom: 10,
  },
  optionCardRecommended: {
    backgroundColor: '#F5FAF5',
    borderColor: '#A5D6A7',
  },
  optionTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  optionTitleCol: {
    flex: 1,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  optionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  recommendedBadge: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  replaceBadge: {
    backgroundColor: '#E65100',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  replaceBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  optionDesc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  optionActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    gap: 4,
  },
  optionActionTextGood: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  optionActionTextWarning: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E65100',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#E8D5A0',
    borderRadius: Radius.md,
    padding: 10,
    marginTop: 4,
    marginBottom: Spacing.md,
    width: '100%',
  },
  tipText: {
    flex: 1,
    fontSize: 11,
    color: '#8C6D1F',
    lineHeight: 16,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textTertiary,
  },
});
