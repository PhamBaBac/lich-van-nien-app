import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface FeedbackModalProps {
  visible: boolean;
  type?: 'success' | 'info' | 'warning';
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  visible,
  type = 'success',
  title,
  message,
  buttonText = 'Đã Hiểu',
  onClose,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle' as const, color: '#2E7D32', bg: '#E8F5E9' };
      case 'warning':
        return { name: 'warning' as const, color: '#D32F2F', bg: '#FFEBEE' };
      default:
        return { name: 'information-circle' as const, color: Colors.cinnabar, bg: 'rgba(169, 38, 44, 0.08)' };
    }
  };

  const iconInfo = getIcon();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: iconInfo.bg }]}>
            <Ionicons name={iconInfo.name} size={32} color={iconInfo.color} />
          </View>

          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.messageText}>{message}</Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
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
    maxWidth: 330,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.xs,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: Radius.md,
    backgroundColor: Colors.cinnabar,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
