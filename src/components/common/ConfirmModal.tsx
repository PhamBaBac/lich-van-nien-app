import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  itemName,
  confirmText = 'Xác Nhận Xóa',
  cancelText = 'Giữ Lại',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Icon huy hiệu đỏ chu sa cảnh báo */}
          <View style={styles.iconCircle}>
            <Ionicons
              name={isDestructive ? 'trash-outline' : 'help-circle-outline'}
              size={28}
              color={isDestructive ? Colors.cinnabar : Colors.goldDark}
            />
          </View>

          {/* Tiêu đề & Nội dung */}
          <Text style={styles.titleText}>{title}</Text>

          {itemName ? (
            <View style={styles.itemBadge}>
              <Text style={styles.itemBadgeText} numberOfLines={1}>
                {itemName}
              </Text>
            </View>
          ) : null}

          <Text style={styles.messageText}>{message}</Text>

          {/* Hàng nút bấm Hành động */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              onPress={onCancel}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                isDestructive ? styles.destructiveButton : styles.primaryButton,
              ]}
              activeOpacity={0.8}
              onPress={onConfirm}
            >
              <Ionicons
                name={isDestructive ? 'trash' : 'checkmark'}
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(169, 38, 44, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  itemBadge: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8D5A0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    marginVertical: 6,
    maxWidth: '90%',
  },
  itemBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
  messageText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.lg,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: '#F3EFE6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  confirmButton: {
    flex: 1.3,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButton: {
    backgroundColor: Colors.cinnabar,
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: Colors.goldDark,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
