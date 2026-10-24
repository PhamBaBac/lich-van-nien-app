import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { FullDayData } from '../../core/types/lunar.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AppSplashScreenProps {
  todayData: FullDayData;
  onFinish: () => void;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  todayData,
  onFinish,
}) => {
  const insets = useSafeAreaInsets();
  const [loadingText, setLoadingText] = useState('Khởi tạo thiên văn GMT+7...');

  // Animation values sử dụng useState để tuân thủ quy tắc React Compiler & React 19
  const [fadeAnim] = useState(() => new Animated.Value(1));
  const [scaleAnim] = useState(() => new Animated.Value(0.92));
  const [progressAnim] = useState(() => new Animated.Value(0));

  const fadeOutAndEnter = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  }, [fadeAnim, onFinish]);

  useEffect(() => {
    // 1. Phóng to nhẹ nhàng logo khi xuất hiện
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 20,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // 2. Chạy thanh tiến trình loading từ 0 -> 100%
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start(() => {
      // Khi tải xong, fade out mượt mà để vào app
      fadeOutAndEnter();
    });

    // Thay đổi trạng thái chữ tải dữ liệu theo thời gian
    const t1 = setTimeout(() => {
      setLoadingText('Đồng bộ dữ liệu Lễ Tết & Sổ Giỗ...');
    }, 700);

    const t2 = setTimeout(() => {
      setLoadingText('Hoàn tất. Kính chúc một ngày an lành!');
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [scaleAnim, progressAnim, fadeOutAndEnter]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 14),
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}
    >
      {/* Góc họa tiết kỷ hà Á Đông trang trí */}
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />

      {/* Phần Giữa: Triện Đỏ, Tên App & Lịch Ngày Hôm Nay */}
      <View style={styles.centerContent}>
        <Animated.View style={[styles.brandingContainer, { transform: [{ scale: scaleAnim }] }]}>
          {/* Con Dấu Triện Đỏ Chu Sa Hoàng Tộc */}
          <View style={styles.sealOuterBorder}>
            <View style={styles.sealInnerBadge}>
              <Text style={styles.sealCharacter}>AN</Text>
            </View>
          </View>

          {/* Tên Thương Hiệu */}
          <Text style={styles.appName}>AN LỊCH</Text>

          {/* Divider hoa sen phong thủy */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Ionicons name="flower-outline" size={13} color={Colors.gold} style={{ marginHorizontal: 8 }} />
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.appSlogan}>LỊCH VẠN NIÊN ĐƯƠNG ĐẠI</Text>
        </Animated.View>

        {/* Tấm Thiệp Ngày Mới Chào Đón */}
        <View style={styles.greetingCard}>
          <View style={styles.greetingHeader}>
            <Ionicons name="sunny-outline" size={16} color={Colors.cinnabar} />
            <Text style={styles.greetingHeaderTitle}>KHỞI NHẬT CÁT LÀNH</Text>
          </View>

          <Text style={styles.greetingSolarDate}>
            {todayData.solar.dayOfWeek}, Ngày {todayData.solar.day}/{todayData.solar.month}/{todayData.solar.year}
          </Text>

          <View style={styles.lunarDateRow}>
            <Ionicons name="moon-outline" size={13} color="#8C6D1F" />
            <Text style={styles.greetingLunarDate}>
              Âm lịch: Ngày {todayData.lunar.day} {todayData.lunar.monthName} ({todayData.canChi.dayCanChi})
            </Text>
          </View>

          {/* Huy hiệu Ngày Hoàng Đạo */}
          <View style={styles.zodiacBadgeRow}>
            <View
              style={[
                styles.zodiacTag,
                todayData.fengShui.isZodiacDay ? styles.zodiacGood : styles.zodiacNormal,
              ]}
            >
              {todayData.fengShui.isZodiacDay && (
                <Ionicons name="star" size={11} color="#8C6D1F" style={{ marginRight: 4 }} />
              )}
              <Text style={styles.zodiacTagText}>
                {todayData.fengShui.isZodiacDay ? 'NGÀY HOÀNG ĐẠO' : 'NGÀY HẮC ĐẠO'} • {todayData.fengShui.zodiacName}
              </Text>
            </View>
          </View>

          {/* Câu châm ngôn khởi nhật */}
          {todayData.quote ? (
            <View style={styles.quoteBox}>
              <Text style={styles.quoteText}>“{todayData.quote.content}”</Text>
              {todayData.quote.author ? (
                <Text style={styles.quoteAuthor}>— {todayData.quote.author}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* Phần Chân: Thanh Tiến Trình & Nút Vào Ngay */}
      <View style={styles.bottomSection}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.loadingStatusText}>{loadingText}</Text>
        </View>

        <TouchableOpacity
          style={styles.enterNowButton}
          activeOpacity={0.8}
          onPress={fadeOutAndEnter}
        >
          <Text style={styles.enterNowText}>Vào Lịch Ngay</Text>
          <Ionicons name="arrow-forward" size={13} color={Colors.cinnabar} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAF8F5', // Nền giấy Dó thuần tịnh
    zIndex: 9999,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#E8D5A0',
  },
  cornerTopRight: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#E8D5A0',
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#E8D5A0',
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 24,
    height: 24,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#E8D5A0',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  sealOuterBorder: {
    width: 78,
    height: 78,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: '#D4AF37',
    padding: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 6,
    marginBottom: Spacing.sm,
  },
  sealInnerBadge: {
    flex: 1,
    backgroundColor: Colors.cinnabar,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealCharacter: {
    color: '#FFFDF0',
    fontSize: 34,
    fontWeight: '900',
    fontFamily: 'serif',
    letterSpacing: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.cinnabar,
    letterSpacing: 4,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginVertical: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D5A0',
  },
  appSlogan: {
    fontSize: 11,
    fontWeight: '800',
    color: '#8C6D1F',
    letterSpacing: 2,
  },
  greetingCard: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  greetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  greetingHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 1,
  },
  greetingSolarDate: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  lunarDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: Spacing.sm,
  },
  greetingLunarDate: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8C6D1F',
  },
  zodiacBadgeRow: {
    marginBottom: Spacing.sm,
  },
  zodiacTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  zodiacGood: {
    backgroundColor: Colors.goldSoft,
    borderColor: Colors.gold,
  },
  zodiacNormal: {
    backgroundColor: '#EDF2F7',
    borderColor: '#CBD5E0',
  },
  zodiacTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  quoteBox: {
    backgroundColor: '#FAF8F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: Colors.cinnabar,
  },
  quoteText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 11,
    color: '#8C6D1F',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 3,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  progressContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#EFECE6',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.cinnabar,
    borderRadius: 2,
  },
  loadingStatusText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  enterNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  enterNowText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
});
