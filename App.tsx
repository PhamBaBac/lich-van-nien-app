import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar as RNStatusBar,
  LogBox,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import {
  getFullDayData,
  FullDayData,
  getLunarMonthName,
  getHolidayDetails,
} from './src/core';
import { Colors } from './src/theme/colors';
import { Spacing, Radius } from './src/theme/spacing';
import { DayBlock } from './src/components/calendar/DayBlock';
import { ZodiacTimeline } from './src/components/timeline/ZodiacTimeline';
import { BentoCards } from './src/components/calendar/BentoCards';
import { MonthGrid } from './src/components/calendar/MonthGrid';
import { DatePickerModal } from './src/components/calendar/DatePickerModal';
import { AddAnniversaryModal } from './src/components/events/AddAnniversaryModal';
import { RestoreBackupModal } from './src/components/events/RestoreBackupModal';
import { ConfirmModal } from './src/components/common/ConfirmModal';
import { FeedbackModal } from './src/components/common/FeedbackModal';
import {
  getAnniversaries,
  addAnniversary,
  deleteAnniversary,
} from './src/services/anniversaryService';
import {
  requestNotificationPermissions,
  scheduleImportantDatesOnly,
} from './src/services/notificationService';
import { exportBackupFile, importBackupFile } from './src/services/backupService';
import { AnniversaryDisplayInfo } from './src/core/types/event.types';
import { SAMPLE_PRAYERS, Prayer } from './src/data/prayers';
import { Ionicons } from '@expo/vector-icons';
import {
  updateAllAndroidWidgets,
  pinAndroidWidget,
  isAndroidWidgetSupported,
} from './src/widgets/widgetManager';

// Bỏ qua cảnh báo thông tin của Expo Go về Remote Push Notifications (App sử dụng Local Notifications hoàn toàn hoạt động bình thường)
LogBox.ignoreLogs([
  '[expo-notifications] Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
  '`shouldShowAlert` is deprecated',
]);

type TabType = 'day' | 'month' | 'utilities' | 'events';

// Phân tích dữ liệu ngày từ payload thông báo hoặc deep link
function parseDatePayload(data: any): Date | null {
  if (!data) return null;

  if (data.solarYear && data.solarMonth && data.solarDay) {
    const y = parseInt(String(data.solarYear), 10);
    const m = parseInt(String(data.solarMonth), 10);
    const d = parseInt(String(data.solarDay), 10);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m - 1, d, 12, 0, 0);
    }
  }

  if (typeof data.solarDateString === 'string') {
    const match = data.solarDateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (match) {
      const y = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const d = parseInt(match[3], 10);
      return new Date(y, m - 1, d, 12, 0, 0);
    }
    const parsed = new Date(data.solarDateString);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  if (typeof data.url === 'string') {
    const fromUrl = parseUrlPayload(data.url);
    if (fromUrl?.date) return fromUrl.date;
  }

  return null;
}

// Phân tích URL Scheme (anlich://calendar?date=YYYY-MM-DD&tab=month)
function parseUrlPayload(url: string | null): { date: Date | null; tab?: TabType } | null {
  if (!url) return null;
  try {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    const params: Record<string, string> = {};
    queryString.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      }
    });

    let targetDate: Date | null = null;
    if (params.date) {
      const match = params.date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (match) {
        targetDate = new Date(
          parseInt(match[1], 10),
          parseInt(match[2], 10) - 1,
          parseInt(match[3], 10),
          12,
          0,
          0
        );
      } else {
        const d = new Date(params.date);
        if (!isNaN(d.getTime())) targetDate = d;
      }
    }
    const tab =
      params.tab === 'day' || params.tab === 'month' || params.tab === 'utilities' || params.tab === 'events'
        ? (params.tab as TabType)
        : 'month';
    return { date: targetDate, tab };
  } catch {
    return null;
  }
}

function MainCalendarApp() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('day');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isAddAnniversaryVisible, setIsAddAnniversaryVisible] = useState(false);
  const [isRestoreModalVisible, setIsRestoreModalVisible] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);

  // Quản lý Modal xác nhận xóa & phản hồi đồng bộ
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    visible: boolean;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
  } | null>(null);

  // Danh sách sự kiện ngày giỗ thực tế (lưu trữ AsyncStorage)
  const [anniversaries, setAnniversaries] = useState<AnniversaryDisplayInfo[]>([]);

  useEffect(() => {
    // 1. Tải danh sách ngày giỗ và lập lịch thông báo CHỈ vào đúng các dịp quan trọng (Lễ, Rằm, Mùng 1 & Giỗ)
    getAnniversaries().then(async (list) => {
      setAnniversaries(list);
      const granted = await requestNotificationPermissions();
      if (granted) {
        scheduleImportantDatesOnly(list);
      }
    });

    // 2. Tự động đồng bộ và cập nhật Widget màn hình chính Android sau khi app đã ổn định
    const widgetTimer = setTimeout(() => {
      updateAllAndroidWidgets().catch(() => {});
    }, 1500);

    // 2. Hàm điều hướng khi người dùng bấm vào thông báo hoặc deep link
    const handleNavigateToEvent = (data: any) => {
      if (!data) return;
      const targetDate = parseDatePayload(data);
      if (targetDate && !isNaN(targetDate.getTime())) {
        setCurrentDate(targetDate);
      }
      if (data.targetTab === 'month' || data.tab === 'month' || !data.targetTab) {
        setActiveTab('month');
      } else if (data.targetTab) {
        setActiveTab(data.targetTab);
      }
    };

    // Khi người dùng bấm thông báo trong khi app đang mở hoặc chạy ngầm
    const notificationResponseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        try {
          const data = response?.notification?.request?.content?.data;
          if (data) {
            handleNavigateToEvent(data);
          }
        } catch (err) {
          console.warn('Lỗi xử lý phản hồi thông báo:', err);
        }
      });

    // Khi mở app từ trạng thái đóng hoàn toàn (Cold Start) do bấm thông báo
    Notifications.getLastNotificationResponseAsync().then((response) => {
      try {
        if (response) {
          const data = response?.notification?.request?.content?.data;
          if (data) {
            handleNavigateToEvent(data);
          }
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra thông báo khởi động:', err);
      }
    });

    // Lắng nghe URL Deep Link (anlich://...) khi app đang chạy
    const linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      try {
        const parsed = parseUrlPayload(url);
        if (parsed?.date) {
          setCurrentDate(parsed.date);
        }
        if (parsed?.tab) {
          setActiveTab(parsed.tab);
        }
      } catch (err) {
        console.warn('Lỗi xử lý deep link URL:', err);
      }
    });

    // Xử lý URL Deep Link ban đầu (Cold Start)
    Linking.getInitialURL().then((url) => {
      try {
        if (url) {
          const parsed = parseUrlPayload(url);
          if (parsed?.date) {
            setCurrentDate(parsed.date);
          }
          if (parsed?.tab) {
            setActiveTab(parsed.tab);
          }
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra initial URL:', err);
      }
    });

    return () => {
      clearTimeout(widgetTimer);
      notificationResponseSubscription.remove();
      linkingSubscription.remove();
    };
  }, []);

  const handlePinWidget = async (type: 'LichNgay' | 'LichChiTiet') => {
    if (Platform.OS !== 'android') {
      setFeedbackModal({
        visible: true,
        type: 'info',
        title: 'Tiện Ích Màn Hình',
        message:
          'Tính năng ghim nhanh hiện hỗ trợ trên thiết bị Android. Trên iOS, bạn có thể nhấn giữ màn hình chính để thêm Widget.',
      });
      return;
    }
    if (!isAndroidWidgetSupported()) {
      setFeedbackModal({
        visible: true,
        type: 'info',
        title: 'Yêu Cầu Bản Cài Đặt (APK)',
        message:
          'Widget màn hình chính chạy trên hệ thống Native của Android. Tính năng này sẽ hoạt động khi bạn cài đặt file APK hoàn chỉnh trên điện thoại (không hỗ trợ chạy trong Expo Go).',
      });
      return;
    }
    const pinned = await pinAndroidWidget(type);
    if (pinned) {
      setFeedbackModal({
        visible: true,
        type: 'success',
        title: 'Yêu Cầu Ghim Widget',
        message:
          'Hộp thoại đã được gửi tới màn hình chính! Bạn vui lòng xác nhận để đưa tiện ích ra màn hình điện thoại.',
      });
    } else {
      setFeedbackModal({
        visible: true,
        type: 'info',
        title: 'Cách Thêm Tiện Ích',
        message:
          'Bạn có thể nhấn giữ vào biểu tượng ứng dụng An Lịch ngoài màn hình điện thoại, chọn mục "Tiện ích (Widgets)" rồi kéo ra màn hình chính nhé!',
      });
    }
  };

  const handleSaveAnniversary = async (data: {
    title: string;
    personName?: string;
    lunarDay: number;
    lunarMonth: number;
    remindDaysBefore: number;
    notes?: string;
  }) => {
    const updated = await addAnniversary(data);
    setAnniversaries(updated);
    scheduleImportantDatesOnly(updated);
    setFeedbackModal({
      visible: true,
      type: 'success',
      title: 'Đã Thêm Ngày Giỗ',
      message: `Đã lưu "${data.title}" vào sổ giỗ và gắn dấu nhắc nhở (ngọn lửa) trên lịch.`,
    });
  };

  const handleDeleteAnniversary = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      const updated = await deleteAnniversary(deleteTarget.id);
      setAnniversaries(updated);
      scheduleImportantDatesOnly(updated);
      setDeleteTarget(null);
    }
  };

  const handleExportBackup = async () => {
    if (anniversaries.length === 0) {
      setFeedbackModal({
        visible: true,
        type: 'info',
        title: 'Sổ Giỗ Đang Trống',
        message: 'Bạn chưa có ngày giỗ nào để sao lưu. Hãy thêm ít nhất một ngày giỗ trước nhé!',
      });
      return;
    }

    const res = await exportBackupFile();
    if (!res.success) {
      setFeedbackModal({
        visible: true,
        type: 'warning',
        title: 'Không Thể Sao Lưu',
        message: res.message,
      });
    }
  };

  const handleOpenRestoreModal = () => {
    setIsRestoreModalVisible(true);
  };

  const handleSelectRestoreMode = async (mode: 'merge' | 'replace') => {
    setIsRestoreModalVisible(false);
    const res = await importBackupFile(mode);
    if (res) {
      if (res.success && res.updatedList) {
        setAnniversaries(res.updatedList);
        scheduleImportantDatesOnly(res.updatedList);
      }
      setFeedbackModal({
        visible: true,
        type: res.success ? 'success' : 'warning',
        title: res.success ? 'Khôi Phục Thành Công' : 'Khôi Phục Thất Bại',
        message: res.message,
      });
    }
  };

  // Tính toán dữ liệu trọn vẹn của ngày được chọn
  const dayData: FullDayData = useMemo(() => {
    return getFullDayData(currentDate);
  }, [currentDate]);

  // Lọc danh sách ngày giỗ trùng với ngày đang xem (theo ngày & tháng Âm lịch)
  const currentDayAnniversaries = useMemo(() => {
    return anniversaries.filter(
      (a) => a.lunarDay === dayData.lunar.day && a.lunarMonth === dayData.lunar.month
    );
  }, [anniversaries, dayData.lunar.day, dayData.lunar.month]);

  // Thông tin chi tiết ngày lễ của ngày đang xem (nếu có)
  const currentHolidayDetail = useMemo(() => {
    return getHolidayDetails(
      dayData.solar.day,
      dayData.solar.month,
      dayData.lunar.day,
      dayData.lunar.month
    );
  }, [dayData.solar.day, dayData.solar.month, dayData.lunar.day, dayData.lunar.month]);

  // Điều hướng chuyển ngày
  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="dark" />

      {/* Main Top App Header với Dynamic Safe Padding chống đè Status Bar */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: Math.max(
              insets.top,
              Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 14
            ),
          },
        ]}
      >
        <View style={styles.brandingGroup}>
          <View style={styles.sealBadge}>
            <Text style={styles.sealText}>AN</Text>
          </View>
          <View>
            <Text style={styles.appName}>AN LỊCH</Text>
            <Text style={styles.appSub}>Lịch Vạn Niên Đương Đại</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          {!dayData.solar.isToday && (
            <TouchableOpacity style={styles.todayButton} onPress={handleToday}>
              <Ionicons name="today-outline" size={14} color={Colors.cinnabar} />
              <Text style={styles.todayButtonText}>Hôm nay</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.convertButton}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Ionicons name="swap-horizontal" size={18} color={Colors.cinnabar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content Area Based on Active Tab */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'day' && (
          <View>
            <DayBlock
              data={dayData}
              anniversaries={currentDayAnniversaries}
              onPressDate={() => setIsDatePickerVisible(true)}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onToday={handleToday}
            />

            {/* Khối chi tiết Ngày Giỗ nếu ngày đang xem có Lễ Giỗ */}
            {currentDayAnniversaries.length > 0 && (
              <View style={styles.dayAnniversaryCard}>
                <View style={styles.dayAnniversaryHeader}>
                  <View style={styles.dayAnniversaryBadge}>
                    <Ionicons name="flame" size={15} color="#FFFFFF" />
                    <Text style={styles.dayAnniversaryBadgeText}>LỄ GIỖ GIA TIÊN HÔM NAY</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.openBookBtn}
                    onPress={() => setActiveTab('events')}
                  >
                    <Text style={styles.openBookBtnText}>Sổ Giỗ</Text>
                    <Ionicons name="chevron-forward" size={12} color="#8C6D1F" />
                  </TouchableOpacity>
                </View>

                {currentDayAnniversaries.map((ev) => (
                  <View key={ev.id} style={styles.dayAnniversaryContent}>
                    <Text style={styles.dayAnniversaryTitle}>{ev.title}</Text>
                    {ev.personName ? (
                      <Text style={styles.dayAnniversaryPerson}>
                        Tưởng nhớ: <Text style={{ fontWeight: '700', color: Colors.cinnabar }}>{ev.personName}</Text>
                      </Text>
                    ) : null}

                    <View style={styles.anniversaryMetaRow}>
                      <View style={styles.anniversaryMetaPill}>
                        <Ionicons name="moon-outline" size={13} color={Colors.cinnabar} />
                        <Text style={styles.anniversaryMetaText}>
                          Ngày {ev.lunarDay} {getLunarMonthName(ev.lunarMonth)} (Âm)
                        </Text>
                      </View>
                      <View style={[styles.anniversaryMetaPill, { backgroundColor: '#F3EFE6' }]}>
                        <Ionicons name="calendar-outline" size={13} color="#8C6D1F" />
                        <Text style={[styles.anniversaryMetaText, { color: '#8C6D1F' }]}>
                          {dayData.solar.dayOfWeek}, {dayData.solar.day}/{dayData.solar.month}/{dayData.solar.year}
                        </Text>
                      </View>
                    </View>

                    {ev.notes ? (
                      <View style={styles.anniversaryNotesBox}>
                        <Ionicons name="document-text-outline" size={14} color="#8C6D1F" style={{ marginTop: 2 }} />
                        <Text style={styles.anniversaryNotesText}>
                          <Text style={{ fontWeight: '700' }}>Ghi chú cúng lễ:</Text> {ev.notes}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            {/* Khối chi tiết Ngày Lễ Tết nếu ngày đang xem là ngày lễ */}
            {currentHolidayDetail && (
              <View style={styles.dayHolidayCard}>
                <View style={styles.dayHolidayHeader}>
                  <View style={styles.dayHolidayBadge}>
                    <Ionicons name="sparkles" size={13} color="#FFFFFF" />
                    <Text style={styles.dayHolidayBadgeText}>
                      {currentHolidayDetail.isMajor ? 'ĐẠI LỄ HÔM NAY' : 'NGÀY LỄ HÔM NAY'}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.holidayCategoryPill,
                      currentHolidayDetail.isLunar ? styles.pillLunar : styles.pillSolar,
                    ]}
                  >
                    <Ionicons
                      name={currentHolidayDetail.isLunar ? 'moon' : 'sunny'}
                      size={10}
                      color={currentHolidayDetail.isLunar ? Colors.cinnabar : '#0284C7'}
                      style={{ marginRight: 3 }}
                    />
                    <Text
                      style={[
                        styles.holidayCategoryPillText,
                        currentHolidayDetail.isLunar ? styles.pillTextLunar : styles.pillTextSolar,
                      ]}
                    >
                      {currentHolidayDetail.isLunar ? 'Lễ Âm Lịch' : 'Lễ Dương Lịch'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.dayHolidayTitle}>{currentHolidayDetail.title}</Text>
                {currentHolidayDetail.description ? (
                  <Text style={styles.dayHolidayDesc}>{currentHolidayDetail.description}</Text>
                ) : null}
              </View>
            )}

            <ZodiacTimeline hours={dayData.zodiacHours} />

            <BentoCards fengShui={dayData.fengShui} canChi={dayData.canChi} />
          </View>
        )}

        {activeTab === 'month' && (
          <View style={{ paddingTop: Spacing.sm }}>
            <MonthGrid
              currentDate={currentDate}
              anniversaries={anniversaries}
              onSelectDate={(newDate) => {
                setCurrentDate(newDate);
              }}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />

            {/* Thông tin & chi tiết ngày đang chọn trong tháng */}
            {currentDayAnniversaries.length > 0 ? (
              <View style={styles.monthAnniversaryCard}>
                <View style={styles.monthAnniversaryHeader}>
                  <View style={styles.dayAnniversaryBadge}>
                    <Ionicons name="flame" size={15} color="#FFFFFF" />
                    <Text style={styles.dayAnniversaryBadgeText}>NGÀY GIỖ GIA TIÊN</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewDetailBtn}
                    onPress={() => setActiveTab('day')}
                  >
                    <Text style={styles.viewDetailBtnText}>Xem Tờ Lịch</Text>
                    <Ionicons name="arrow-forward" size={11} color="#8C6D1F" style={{ marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>

                {currentDayAnniversaries.map((ev) => (
                  <View key={ev.id} style={styles.monthAnniversaryContent}>
                    <Text style={styles.dayAnniversaryTitle}>{ev.title}</Text>
                    {ev.personName ? (
                      <Text style={styles.dayAnniversaryPerson}>
                        Tưởng nhớ: <Text style={{ fontWeight: '700', color: Colors.cinnabar }}>{ev.personName}</Text>
                      </Text>
                    ) : null}

                    <View style={styles.anniversaryMetaRow}>
                      <View style={styles.anniversaryMetaPill}>
                        <Ionicons name="moon-outline" size={13} color={Colors.cinnabar} />
                        <Text style={styles.anniversaryMetaText}>
                          Ngày {ev.lunarDay} {getLunarMonthName(ev.lunarMonth)} (Âm)
                        </Text>
                      </View>
                      <View style={[styles.anniversaryMetaPill, { backgroundColor: '#F3EFE6' }]}>
                        <Ionicons name="calendar-outline" size={13} color="#8C6D1F" />
                        <Text style={[styles.anniversaryMetaText, { color: '#8C6D1F' }]}>
                          Dương lịch: {dayData.solar.day}/{dayData.solar.month}/{dayData.solar.year}
                        </Text>
                      </View>
                    </View>

                    {ev.notes ? (
                      <View style={styles.anniversaryNotesBox}>
                        <Ionicons name="document-text-outline" size={14} color="#8C6D1F" style={{ marginTop: 2 }} />
                        <Text style={styles.anniversaryNotesText}>
                          <Text style={{ fontWeight: '700' }}>Ghi chú cúng lễ:</Text> {ev.notes}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.monthSelectionCard}>
                <View style={styles.monthSelectionHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                    <Text style={styles.monthSelectionTitle}>
                      Ngày {dayData.solar.day}/{dayData.solar.month} (Dương)
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color={Colors.cinnabar}
                      style={{ marginHorizontal: 4 }}
                    />
                    <Text style={styles.monthSelectionTitle}>
                      {dayData.lunar.day}/{dayData.lunar.month} (Âm)
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewDetailBtn}
                    onPress={() => setActiveTab('day')}
                  >
                    <Text style={styles.viewDetailBtnText}>Xem Tờ Lịch</Text>
                    <Ionicons name="arrow-forward" size={11} color="#8C6D1F" style={{ marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>

                {/* Huy hiệu hiển thị rõ sự kiện Rằm, Mùng 1 hoặc Lễ Tết khi chọn ngày */}
                {dayData.holiday ? (
                  <View style={styles.specialDayTagRow}>
                    <Ionicons name="sparkles" size={13} color="#B3261E" style={{ marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.specialDayTagHoliday}>{dayData.holiday}</Text>
                      {currentHolidayDetail?.description ? (
                        <Text style={styles.specialDayTagDesc}>{currentHolidayDetail.description}</Text>
                      ) : null}
                    </View>
                  </View>
                ) : dayData.lunar.day === 15 ? (
                  <View style={styles.specialDayTagRow}>
                    <Ionicons name="moon" size={13} color="#D97706" />
                    <Text style={styles.specialDayTagSpecial}>
                      Ngày Rằm (Vọng) • {getLunarMonthName(dayData.lunar.month)}
                    </Text>
                  </View>
                ) : dayData.lunar.day === 1 ? (
                  <View style={styles.specialDayTagRow}>
                    <Ionicons name="leaf" size={13} color="#16A34A" />
                    <Text style={styles.specialDayTagMung1}>
                      Mùng Một (Sóc) • Khởi đầu {getLunarMonthName(dayData.lunar.month)}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.monthSelectionSubRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.monthSelectionSub}>
                      Ngày {dayData.canChi.dayCanChi} •{' '}
                    </Text>
                    {dayData.fengShui.isZodiacDay && (
                      <Ionicons name="star" size={11} color={Colors.gold} style={{ marginRight: 3 }} />
                    )}
                    <Text
                      style={[
                        styles.monthSelectionSub,
                        dayData.fengShui.isZodiacDay ? { color: Colors.goldDark, fontWeight: '700' } : null,
                      ]}
                    >
                      {dayData.fengShui.isZodiacDay ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addAnniversaryQuickBtn}
                    onPress={() => setIsAddAnniversaryVisible(true)}
                  >
                    <Ionicons name="add-circle-outline" size={14} color={Colors.cinnabar} />
                    <Text style={styles.addAnniversaryQuickText}>Thêm Giỗ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {activeTab === 'utilities' && (
          <View style={styles.tabContentPadding}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={20} color={Colors.cinnabar} />
              <Text style={styles.sectionTitle}>KHO TÀNG VĂN KHẤN CỔ TRUYỀN</Text>
            </View>

            <View style={styles.prayersList}>
              {SAMPLE_PRAYERS.map((prayer) => (
                <TouchableOpacity
                  key={prayer.id}
                  style={styles.prayerCard}
                  activeOpacity={0.8}
                  onPress={() => setSelectedPrayer(prayer)}
                >
                  <View style={styles.prayerCardHeader}>
                    <View style={styles.prayerCategoryBadge}>
                      <Text style={styles.prayerCategoryText}>{prayer.category}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.light.textTertiary} />
                  </View>
                  <Text style={styles.prayerTitleText}>{prayer.title}</Text>
                  <Text style={styles.prayerOccasionText}>{prayer.occasion}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Banner Lời Khuyên Phong Thủy */}
            <View style={styles.utilBanner}>
              <Ionicons name="compass" size={28} color={Colors.gold} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.utilBannerTitle}>La Bàn Phong Thủy & Xuất Hành</Text>
                <Text style={styles.utilBannerDesc}>
                  Hôm nay hướng Hỷ Thần ở {dayData.fengShui.directions.joyGod}, Tài Thần ở {dayData.fengShui.directions.wealthGod}.
                </Text>
              </View>
            </View>

            {/* Tiện Ích Màn Hình Chính (Home Screen Widget) */}
            <View style={styles.widgetCard}>
              <View style={styles.widgetHeaderRow}>
                <View style={styles.widgetIconWrap}>
                  <Ionicons name="apps" size={20} color={Colors.cinnabar} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.widgetCardTitle}>TIỆN ÍCH MÀN HÌNH CHÍNH (WIDGET)</Text>
                  <Text style={styles.widgetCardDesc}>
                    Xem nhanh ngày âm dương, hoàng đạo ngay trên màn hình điện thoại mà không cần mở ứng dụng.
                  </Text>
                </View>
              </View>

              <View style={styles.widgetBtnRow}>
                <TouchableOpacity
                  style={styles.widgetPinBtn}
                  activeOpacity={0.8}
                  onPress={() => handlePinWidget('LichNgay')}
                >
                  <Ionicons name="calendar" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.widgetPinBtnText}>Lịch Ngày (2x2)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.widgetPinBtn, styles.widgetPinDetailBtn]}
                  activeOpacity={0.8}
                  onPress={() => handlePinWidget('LichChiTiet')}
                >
                  <Ionicons name="grid-outline" size={16} color="#8C6D1F" style={{ marginRight: 6 }} />
                  <Text style={styles.widgetPinDetailBtnText}>Lịch Chi Tiết (4x2)</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.widgetGuideTip}>
                💡 Mẹo: Bạn cũng có thể nhấn giữ biểu tượng ứng dụng "An Lịch" ngoài màn hình chính để mở danh sách Tiện ích.
              </Text>
            </View>
          </View>
        )}

        {activeTab === 'events' && (
          <View style={styles.tabContentPadding}>
            {/* Card Sao Lưu & Khôi Phục Dữ Liệu (Google Drive / Tệp tin / Zalo) */}
           <View style={styles.backupActionsRow}>
                <TouchableOpacity
                  style={styles.backupActionBtn}
                  onPress={handleExportBackup}
                >
                  <Ionicons name="cloud-upload" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.backupActionBtnText}>Sao lưu dữ liếu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.backupActionBtn, styles.restoreActionBtn]}
                  onPress={handleOpenRestoreModal}
                >
                  <Ionicons name="cloud-download-outline" size={16} color="#8C6D1F" style={{ marginRight: 6 }} />
                  <Text style={styles.restoreActionBtnText}>Khôi phục từ tệp</Text>
                </TouchableOpacity>
              </View>
            {/* Danh sách ngày giỗ thực tế */}
            <View style={{ marginTop: Spacing.sm }}>
              <View style={styles.subSectionHeaderRow}>
                <Text style={styles.subSectionTitle}>LỄ GIỖ GIA TIÊN (THEO ÂM LỊCH)</Text>
                <Text style={styles.countText}>{anniversaries.length} ngày giỗ</Text>
              </View>

              {anniversaries.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={32} color={Colors.light.textTertiary} />
                  <Text style={styles.emptyTitle}>Chưa có ngày giỗ nào</Text>
                  <Text style={styles.emptySub}>
                    Bấm nút bên dưới để thêm ngày giỗ gia tiên. Ứng dụng sẽ tự động quy đổi ra ngày dương lịch hàng năm và gửi thông báo nhắc nhở!
                  </Text>
                </View>
              ) : (
                anniversaries.map((ev) => (
                  <View key={ev.id} style={styles.lunarEventCard}>
                    <View style={styles.eventTopRow}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.eventTitle}>{ev.title}</Text>
                        {ev.personName ? (
                          <Text style={styles.personNameText}>Người quá cố: {ev.personName}</Text>
                        ) : null}
                      </View>
                      <View
                        style={[
                          styles.daysLeftBadge,
                          ev.isUrgent && styles.urgentBadge,
                        ]}
                      >
                        <Text
                          style={[
                            styles.daysLeftText,
                            ev.isUrgent && styles.urgentBadgeText,
                          ]}
                        >
                          {ev.statusText}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.eventDateText}>
                      Âm lịch: Ngày {ev.lunarDay} {getLunarMonthName(ev.lunarMonth)}
                    </Text>

                    <View style={styles.solarOccurrenceBox}>
                      <Ionicons name="calendar" size={14} color={Colors.cinnabar} />
                      <Text style={styles.solarOccurrenceText}>
                        Dương lịch: <Text style={{ fontWeight: '700' }}>{ev.nextSolarString}</Text>
                      </Text>
                    </View>

                    {ev.notes ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                        <Ionicons name="document-text-outline" size={13} color={Colors.light.textSecondary} />
                        <Text style={styles.eventNotesText}>{ev.notes}</Text>
                      </View>
                    ) : null}

                    <View style={styles.eventFooterRow}>
                      <View style={styles.remindTag}>
                        <Ionicons name="alarm-outline" size={13} color="#8C6D1F" />
                        <Text style={styles.remindTagText}>
                          Nhắc trước {ev.remindDaysBefore} ngày (07:00)
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDeleteAnniversary(ev.id, ev.title)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#C62828" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Nút Thêm Ngày Giỗ Mới */}
            <TouchableOpacity
              style={styles.addEventButton}
              onPress={() => setIsAddAnniversaryVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
              <Text style={styles.addEventButtonText}>Thêm Ngày Giỗ Gia Tiên</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Modern Bottom Navigation Bar (4 Tabs Dưới 3 Lần Chạm) */}
      <View
        style={[
          styles.bottomTabBar,
          {
            paddingBottom: Math.max(insets.bottom, 10),
            height: 56 + Math.max(insets.bottom, 10),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('day')}
        >
          <Ionicons
            name={activeTab === 'day' ? 'calendar' : 'calendar-outline'}
            size={22}
            color={activeTab === 'day' ? Colors.cinnabar : Colors.light.textTertiary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'day' && styles.tabLabelActive,
            ]}
          >
            Lịch Ngày
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('month')}
        >
          <Ionicons
            name={activeTab === 'month' ? 'grid' : 'grid-outline'}
            size={22}
            color={activeTab === 'month' ? Colors.cinnabar : Colors.light.textTertiary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'month' && styles.tabLabelActive,
            ]}
          >
            Lịch Tháng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('utilities')}
        >
          <Ionicons
            name={activeTab === 'utilities' ? 'book' : 'book-outline'}
            size={22}
            color={activeTab === 'utilities' ? Colors.cinnabar : Colors.light.textTertiary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'utilities' && styles.tabLabelActive,
            ]}
          >
            Văn Khấn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('events')}
        >
          <Ionicons
            name={activeTab === 'events' ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={activeTab === 'events' ? Colors.cinnabar : Colors.light.textTertiary}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'events' && styles.tabLabelActive,
            ]}
          >
            Ngày Giỗ
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal Bộ Đổi Ngày Siêu Tốc */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onSelectDate={(newDate) => {
          setCurrentDate(newDate);
          setActiveTab('day');
        }}
        initialDate={currentDate}
      />

      {/* Modal Thêm Ngày Giỗ Mới */}
      {isAddAnniversaryVisible && (
        <AddAnniversaryModal
          visible={isAddAnniversaryVisible}
          initialLunarDay={dayData.lunar.day}
          initialLunarMonth={dayData.lunar.month}
          onClose={() => setIsAddAnniversaryVisible(false)}
          onSave={handleSaveAnniversary}
        />
      )}

      {/* Modal Khôi Phục Sổ Giỗ Custom */}
      <RestoreBackupModal
        visible={isRestoreModalVisible}
        currentCount={anniversaries.length}
        onClose={() => setIsRestoreModalVisible(false)}
        onSelectMode={handleSelectRestoreMode}
      />

      {/* Modal Xác Nhận Xóa Ngày Giỗ Đồng Bộ */}
      <ConfirmModal
        visible={!!deleteTarget}
        title="Xác Nhận Xóa Ngày Giỗ"
        itemName={deleteTarget?.title}
        message="Bạn có chắc chắn muốn xóa lễ giỗ này khỏi danh sách nhắc nhở hàng năm không? Thao tác này sẽ không thể hoàn tác."
        confirmText="Xác Nhận Xóa"
        cancelText="Giữ Lại"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Modal Thông Báo Phản Hồi Đồng Bộ */}
      {feedbackModal && (
        <FeedbackModal
          visible={feedbackModal.visible}
          type={feedbackModal.type}
          title={feedbackModal.title}
          message={feedbackModal.message}
          onClose={() => setFeedbackModal(null)}
        />
      )}

      {/* Modal Đọc Văn Khấn Chế Độ Đi Lễ (Ritual Reader) */}
      {selectedPrayer && (
        <Modal visible={true} animationType="slide">
          <View
            style={[
              styles.prayerModalContainer,
              {
                paddingTop: Math.max(
                  insets.top,
                  Platform.OS === 'android' ? (RNStatusBar.currentHeight || 28) : 14
                ),
              },
            ]}
          >
            <View style={styles.prayerModalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedPrayer(null)}
                style={styles.prayerBackBtn}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.cinnabar} />
              </TouchableOpacity>
              <Text style={styles.prayerModalHeaderTitle} numberOfLines={1}>
                {selectedPrayer.title}
              </Text>
            </View>

            <ScrollView style={styles.prayerModalScroll} contentContainerStyle={{ padding: Spacing.lg }}>
              {/* Thẻ Lễ Vật Cần Chuẩn Bị */}
              <View style={styles.offeringsBox}>
                <View style={styles.offeringsHeader}>
                  <Ionicons name="basket-outline" size={18} color={Colors.cinnabar} />
                  <Text style={styles.offeringsTitle}>SẮM LỄ VẬT CHUẨN BỊ</Text>
                </View>
                {selectedPrayer.offerings.map((item, idx) => (
                  <View key={idx} style={styles.offeringItem}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.goldDark} style={{ marginRight: 6, marginTop: 1 }} />
                    <Text style={styles.offeringText}>{item}</Text>
                  </View>
                ))}
              </View>

              {/* Toàn Văn Bài Khấn */}
              <View style={styles.prayerTextBox}>
                <View style={styles.prayerNoticeBox}>
                  <Ionicons name="bulb-outline" size={16} color="#8C6D1F" style={{ marginTop: 1, marginRight: 6 }} />
                  <Text style={styles.prayerNotice}>
                    <Text style={{ fontWeight: '700' }}>Chế độ đi lễ:</Text> Giữ tâm thanh tịnh, thắp hương và thành tâm đọc lời khấn.
                  </Text>
                </View>
                {selectedPrayer.content.map((paragraph, idx) => (
                  <Text key={idx} style={styles.prayerParagraph}>
                    {paragraph}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainCalendarApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#EFECE6',
    backgroundColor: '#FAF8F5',
  },
  brandingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sealBadge: {
    width: 32,
    height: 32,
    backgroundColor: Colors.cinnabar,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sealText: {
    color: '#FFF6E0',
    fontSize: 14,
    fontWeight: '900',
    fontFamily: 'serif',
  },
  appName: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.cinnabar,
    letterSpacing: 1.5,
  },
  appSub: {
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  todayButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
  convertButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFECE6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.textTertiary,
    marginTop: 3,
  },
  tabLabelActive: {
    color: Colors.cinnabar,
    fontWeight: '800',
  },
  monthSelectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  monthSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthSelectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.cinnabar,
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  viewDetailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  monthSelectionSub: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  monthSelectionSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  specialDayTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  specialDayTagHoliday: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B3261E',
  },
  specialDayTagDesc: {
    fontSize: 11,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 15,
  },
  specialDayTagSpecial: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  specialDayTagMung1: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  addAnniversaryQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(169, 38, 44, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  addAnniversaryQuickText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
  dayAnniversaryCard: {
    backgroundColor: '#FFFDF5',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: Spacing.md,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  dayHolidayCard: {
    backgroundColor: '#FFFBF5',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#F87171',
    padding: Spacing.md,
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dayHolidayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingBottom: 6,
  },
  dayHolidayBadge: {
    backgroundColor: Colors.cinnabar,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  dayHolidayBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dayHolidayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.cinnabar,
    marginTop: 4,
    marginBottom: 4,
  },
  dayHolidayDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  dayAnniversaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingBottom: 6,
  },
  dayAnniversaryBadge: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  dayAnniversaryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  openBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  openBookBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  dayAnniversaryContent: {
    marginBottom: 4,
  },
  dayAnniversaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.cinnabar,
    marginBottom: 3,
  },
  dayAnniversaryPerson: {
    fontSize: 13,
    color: Colors.light.textPrimary,
    marginBottom: 6,
  },
  anniversaryMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  anniversaryMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  anniversaryMetaText: {
    fontSize: 12,
    color: Colors.cinnabar,
    fontWeight: '600',
  },
  anniversaryNotesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF5EA',
    borderWidth: 1,
    borderColor: '#E8D5A0',
    padding: 8,
    borderRadius: Radius.sm,
    gap: 6,
    marginTop: 2,
  },
  anniversaryNotesText: {
    flex: 1,
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  monthAnniversaryCard: {
    backgroundColor: '#FFFDF5',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: Spacing.md,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  monthAnniversaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingBottom: 6,
  },
  monthAnniversaryContent: {
    marginBottom: 4,
  },
  tabContentPadding: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 0.5,
  },
  prayersList: {
    gap: 12,
  },
  prayerCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  prayerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  prayerCategoryBadge: {
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  prayerCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  prayerTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginBottom: 4,
  },
  prayerOccasionText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  utilBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDF5',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#E8D5A0',
    marginTop: Spacing.lg,
  },
  utilBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cinnabar,
    marginBottom: 2,
  },
  utilBannerDesc: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 16,
  },
  eventCardSpecial: {
    backgroundColor: Colors.cinnabar,
    padding: Spacing.md,
    borderRadius: Radius.md,
    position: 'relative',
    overflow: 'hidden',
  },
  specialBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  specialBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  eventTitleSpecial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  eventDescSpecial: {
    color: '#FDE8E8',
    fontSize: 12,
    lineHeight: 17,
  },
  subSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.light.textSecondary,
    letterSpacing: 0.5,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.cinnabar,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.xl,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.light.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  lunarEventCard: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  eventTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.light.textPrimary,
  },
  personNameText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  daysLeftBadge: {
    backgroundColor: Colors.goldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E8D5A0',
  },
  daysLeftText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8C6D1F',
  },
  urgentBadge: {
    backgroundColor: '#FDE8E8',
    borderColor: '#F8B4B4',
  },
  urgentBadgeText: {
    color: Colors.cinnabar,
  },
  eventDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.cinnabar,
    marginBottom: 4,
    marginTop: 2,
  },
  solarOccurrenceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    marginBottom: 6,
  },
  solarOccurrenceText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  eventNotesText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    lineHeight: 16,
    marginBottom: 6,
  },
  eventFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.light.divider,
    paddingTop: 6,
    marginTop: 2,
  },
  remindTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  remindTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8C6D1F',
  },
  deleteBtn: {
    padding: 4,
  },
  addEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.cinnabar,
    paddingVertical: 12,
    borderRadius: Radius.md,
    marginTop: Spacing.sm,
  },
  addEventButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  prayerModalContainer: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  prayerModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.divider,
    backgroundColor: '#FFFFFF',
  },
  prayerBackBtn: {
    padding: 6,
    marginRight: 8,
  },
  prayerModalHeaderTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.cinnabar,
  },
  prayerModalScroll: {
    flex: 1,
  },
  offeringsBox: {
    backgroundColor: '#FFFDF5',
    borderWidth: 1,
    borderColor: '#E8D5A0',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  offeringsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.xs,
  },
  offeringsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cinnabar,
  },
  offeringItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  offeringDot: {
    color: Colors.goldDark,
    fontWeight: '700',
  },
  offeringText: {
    fontSize: 12,
    color: Colors.light.textPrimary,
  },
  prayerTextBox: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  prayerNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.goldSoft,
    padding: 8,
    borderRadius: Radius.sm,
    marginBottom: Spacing.md,
  },
  prayerNotice: {
    flex: 1,
    fontSize: 12,
    color: '#8C6D1F',
    lineHeight: 18,
  },
  prayerParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.light.textPrimary,
    marginBottom: Spacing.md,
    fontFamily: 'serif',
  },

  // Segmented control tabs cho mục Sự Kiện
  holidayCategoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillLunar: {
    backgroundColor: '#FEF2F2',
  },
  pillSolar: {
    backgroundColor: '#F0F9FF',
  },
  holidayCategoryPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  pillTextLunar: {
    color: Colors.cinnabar,
  },
  pillTextSolar: {
    color: '#0284C7',
  },

  // Card Sao Lưu & Khôi Phục Dữ Liệu
  backupCard: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1.5,
    borderColor: '#E8D5A0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  backupIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7EDD2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  backupCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#8C6D1F',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  backupCardDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 17,
  },
  backupActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  backupActionBtn: {
    flex: 1.15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cinnabar,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  backupActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restoreActionBtn: {
    flex: 0.85,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E2DACB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  restoreActionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#EFEAE0',
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  widgetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  widgetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetCardTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.cinnabar,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  widgetCardDesc: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    lineHeight: 18,
  },
  widgetBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  widgetPinBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cinnabar,
    borderRadius: Radius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: Colors.cinnabar,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  widgetPinBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  widgetPinDetailBtn: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: '#E2DACB',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  widgetPinDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8C6D1F',
  },
  widgetGuideTip: {
    fontSize: 11,
    color: '#71717A',
    fontStyle: 'italic',
    marginTop: 10,
    lineHeight: 16,
  },
});
