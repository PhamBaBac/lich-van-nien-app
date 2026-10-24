import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingModalProps {
  visible: boolean;
  onFinish: () => void;
}

interface SlideItem {
  id: string;
  badge: string;
  badgeIcon: keyof typeof Ionicons.glyphMap;
  title: string;
  highlightText: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgColor: string;
  features: {
    icon: keyof typeof Ionicons.glyphMap;
    text: string;
  }[];
}

const ONBOARDING_SLIDES: SlideItem[] = [
  {
    id: 'calendar',
    badge: 'AN LỊCH ĐƯƠNG ĐẠI',
    badgeIcon: 'calendar',
    title: 'Lịch Vạn Niên Tinh Hoa',
    highlightText: 'Chuẩn Xác & Trang Nhã',
    description:
      'Kết hợp thuật toán thiên văn học Hồ Ngọc Đức (GMT+7) với phong cách thiết kế Neo-Heritage thuần tịnh, sắc nét và tôn nghiêm.',
    iconName: 'calendar-outline',
    iconColor: Colors.cinnabar,
    iconBgColor: 'rgba(169, 38, 44, 0.08)',
    features: [
      { icon: 'time-outline', text: 'Lịch Âm - Dương song hành chuẩn xác từng giây' },
      { icon: 'star-outline', text: 'Tra cứu 6 giờ Hoàng Đạo & 24 Tiết khí trực quan' },
      { icon: 'checkmark-circle-outline', text: 'Gợi ý việc Nên làm & Kiêng cữ mỗi ngày' },
    ],
  },
  {
    id: 'anniversary',
    badge: 'TƯỞNG NHỚ GIA TIÊN',
    badgeIcon: 'flame',
    title: 'Sổ Giỗ Thông Minh',
    highlightText: 'Tự Động Đổi Ngày Dương',
    description:
      'Chỉ cần nhập ngày mất Âm lịch một lần duy nhất. Ứng dụng tự động quy đổi ngày Dương lịch hàng năm và gắn dấu ngọn lửa ngay trên tờ lịch.',
    iconName: 'flame-outline',
    iconColor: '#D97706',
    iconBgColor: '#FEF3C7',
    features: [
      { icon: 'sync-outline', text: 'Tự động tính ngày Dương lịch hàng năm vĩnh viễn' },
      { icon: 'flame', text: 'Gắn dấu ngọn lửa cúng giỗ nổi bật trên lịch tháng' },
      { icon: 'document-text-outline', text: 'Ghi chú chu đáo mâm cỗ mặn, hoa quả & sắm lễ' },
    ],
  },
  {
    id: 'prayers',
    badge: 'VĂN HÓA TÂM LINH',
    badgeIcon: 'book',
    title: 'Kho Văn Khấn Cổ Truyền',
    highlightText: 'Chế Độ Đi Lễ Tiện Lợi',
    description:
      'Hệ thống bài khấn chuẩn mực truyền thống cho dịp Rằm, Mùng 1, Lễ Tết, Cúng Giỗ... Tích hợp chế độ giữ sáng màn hình khi đang hành lễ.',
    iconName: 'book-outline',
    iconColor: '#8C6D1F',
    iconBgColor: Colors.goldSoft,
    features: [
      { icon: 'book', text: 'Bài khấn cổ truyền chuẩn mực, dễ đọc, tôn nghiêm' },
      { icon: 'bulb-outline', text: 'Chế độ Đi Lễ giữ sáng màn hình & chỉnh cỡ chữ' },
      { icon: 'compass-outline', text: 'Tra cứu Hướng Xuất Hành (Tài Thần, Hỷ Thần)' },
    ],
  },
  {
    id: 'respectful',
    badge: 'TÔN TRỌNG & AN LÀNH',
    badgeIcon: 'shield-checkmark',
    title: 'Chỉ Nhắc Dịp Thiêng Liêng',
    highlightText: 'Tuyệt Đối Không Spam',
    description:
      'Ứng dụng cam kết giữ không gian an tĩnh cho bạn: Không gửi thông báo rác mỗi sáng. Chỉ gửi nhắc nhở vào Lễ Tết, Rằm, Mùng 1 và Ngày Giỗ Gia Tiên.',
    iconName: 'notifications-outline',
    iconColor: Colors.cinnabar,
    iconBgColor: 'rgba(169, 38, 44, 0.08)',
    features: [
      { icon: 'notifications-off-outline', text: 'Không làm phiền mỗi ngày, không quảng cáo' },
      { icon: 'alarm-outline', text: 'Nhắc nhở sắm lễ trước 1 - 3 ngày đúng giờ' },
      { icon: 'cloud-offline-outline', text: 'Hoạt động hoàn toàn Offline, bảo mật dữ liệu' },
    ],
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ visible, onFinish }) => {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_SLIDES.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollRef.current?.scrollTo({
        x: (currentIndex - 1) * SCREEN_WIDTH,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const isLastSlide = currentIndex === ONBOARDING_SLIDES.length - 1;

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, Platform.OS === 'android' ? 24 : 14),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Top Header: Logo Brand & Skip Button */}
        <View style={styles.topHeader}>
          <View style={styles.branding}>
            <View style={styles.sealBadge}>
              <Text style={styles.sealText}>AN</Text>
            </View>
            <View>
              <Text style={styles.appName}>AN LỊCH</Text>
              <Text style={styles.appSub}>Vạn Niên Đương Đại</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.skipBtn} activeOpacity={0.7} onPress={onFinish}>
            <Text style={styles.skipBtnText}>Bỏ qua</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Carousel Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.carousel}
        >
          {ONBOARDING_SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              {/* Oriental Artwork Circle */}
              <View style={styles.artworkContainer}>
                <View style={styles.outerCircle}>
                  <View style={[styles.innerCircle, { backgroundColor: slide.iconBgColor }]}>
                    <Ionicons name={slide.iconName} size={54} color={slide.iconColor} />
                  </View>
                </View>
              </View>

              {/* Tag Badge */}
              <View style={styles.badgeContainer}>
                <Ionicons name={slide.badgeIcon} size={13} color={Colors.cinnabar} style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>{slide.badge}</Text>
              </View>

              {/* Title & Highlight */}
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideHighlight}>{slide.highlightText}</Text>

              {/* Description */}
              <Text style={styles.slideDescription}>{slide.description}</Text>

              {/* Bullet Features */}
              <View style={styles.featuresCard}>
                {slide.features.map((item, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <View style={styles.featureIconBox}>
                      <Ionicons name={item.icon} size={15} color={Colors.cinnabar} />
                    </View>
                    <Text style={styles.featureText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Navigation Controls */}
        <View style={styles.footer}>
          {/* Indicators / Dots */}
          <View style={styles.dotsRow}>
            {ONBOARDING_SLIDES.map((_, idx) => (
              <View
                key={idx}
                style={[
                  styles.dot,
                  currentIndex === idx ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            {currentIndex > 0 ? (
              <TouchableOpacity
                style={styles.backBtn}
                activeOpacity={0.7}
                onPress={handlePrev}
              >
                <Ionicons name="arrow-back" size={18} color={Colors.light.textSecondary} />
                <Text style={styles.backBtnText}>Quay lại</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                isLastSlide && styles.primaryBtnFinal,
              ]}
              activeOpacity={0.85}
              onPress={handleNext}
            >
              <Text style={styles.primaryBtnText}>
                {isLastSlide ? 'Bắt Đầu Trải Nghiệm' : 'Tiếp Tục'}
              </Text>
              <Ionicons
                name={isLastSlide ? 'sparkles' : 'arrow-forward'}
                size={16}
                color="#FFFFFF"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xs,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sealBadge: {
    width: 26,
    height: 26,
    backgroundColor: Colors.cinnabar,
    borderRadius: Radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  appName: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.cinnabar,
    letterSpacing: 1,
  },
  appSub: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    borderRadius: Radius.full,
  },
  skipBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkContainer: {
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: '#E8D5A0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  innerCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(169, 38, 44, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.xs,
  },
  badgeText: {
    color: Colors.cinnabar,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.light.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  slideHighlight: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.cinnabar,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  slideDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  featuresCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureIconBox: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textPrimary,
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.md,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.cinnabar,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#E2D9C8',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backBtn: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 13,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  primaryBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cinnabar,
    paddingVertical: 14,
    borderRadius: Radius.md,
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryBtnFinal: {
    backgroundColor: '#9B1C23',
    flex: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
