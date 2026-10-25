
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';
import { convertSolarToLunar, getLunarMonthName } from '../core';
import { getAllHolidaysForDay } from '../data/holidays';
import { AnniversaryDisplayInfo } from '../core/types/event.types';

// Cấu hình cách hiển thị thông báo khi app đang mở (Foreground)
try {
  if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      }),
    });
  }
} catch (e) {
  console.warn('Lỗi khởi tạo NotificationHandler:', e);
}

/**
 * Thiết lập kênh thông báo cho Android
 */
let isAndroidChannelConfigured = false;

/**
 * Thiết lập kênh thông báo cho Android (chỉ gọi 1 lần và an toàn trên Expo Go)
 */
async function setupAndroidChannels() {
  if (Platform.OS !== 'android' || isAndroidChannelConfigured) return;

  try {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Thông Báo Lễ Tết & Ngày Giỗ',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#A9262C',
      enableVibrate: true,
      enableLights: true,
      // Không truyền sound: 'default' vì Android sẽ tìm file res/raw/default.wav và gây crash NullPointerException trên Expo Go
    });
    isAndroidChannelConfigured = true;
  } catch {
    // Trong môi trường Expo Go trên Android, NotificationChannelManager có thể bị giới hạn.
    // Bắt lỗi an toàn để ứng dụng tiếp tục hoạt động trơn tru.
    isAndroidChannelConfigured = true;
  }
}

/**
 * Yêu cầu quyền gửi thông báo từ người dùng
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  try {
    await setupAndroidChannels();

    const settings = await Notifications.getPermissionsAsync();
    let isGranted = settings.granted || settings.status === 'granted';

    if (!isGranted) {
      const response = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      isGranted = response.granted || response.status === 'granted';
    }

    return isGranted;
  } catch (error) {
    console.warn('Lỗi xin quyền thông báo:', error);
    return true;
  }
}

/**
 * LẬP LỊCH THÔNG BÁO TINH GỌN (CHỈ DỊP QUAN TRỌNG: LỄ, RẰM, MÙNG 1, GIỖ)
 * Quét trước 60 ngày tới để đặt lịch chính xác
 */
export async function scheduleImportantDatesOnly(
  anniversaries: AnniversaryDisplayInfo[] = []
): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    await setupAndroidChannels();

    // 1. Xóa toàn bộ các lịch thông báo cũ (kể cả thông báo rác hàng ngày)
    await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});

    const now = new Date();
    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 2. Lập lịch cho các Ngày Giỗ Gia Tiên
    for (const item of anniversaries) {
      // a. Nhắc nhở trước N ngày lúc 07:00 sáng (CHỈ đặt lịch cho tương lai, tuyệt đối không gửi lặp khi mở app)
      const remindDate = new Date(item.nextSolarDate);
      remindDate.setDate(remindDate.getDate() - item.remindDaysBefore);
      remindDate.setHours(7, 0, 0, 0);

      const nextSolar = item.nextSolarDate;
      const sAnnivYear = nextSolar.getFullYear();
      const sAnnivMonth = nextSolar.getMonth() + 1;
      const sAnnivDay = nextSolar.getDate();
      const annivDateStr = `${sAnnivYear}-${String(sAnnivMonth).padStart(2, '0')}-${String(sAnnivDay).padStart(2, '0')}`;
      const annivUrl = `anlich://calendar?date=${annivDateStr}&tab=month`;

      if (remindDate.getTime() > now.getTime()) {
        const bodyText = item.personName
          ? `Lễ giỗ ${item.personName} (${item.title}) sẽ diễn ra vào ngày ${item.nextSolarString}. Ghi chú: ${item.notes || 'Sắm sửa mâm lễ thành kính.'}`
          : `Lễ giỗ ${item.title} sẽ diễn ra vào ngày ${item.nextSolarString}. Ghi chú: ${item.notes || 'Sắm sửa mâm lễ thành kính.'}`;

        await Notifications.scheduleNotificationAsync({
          identifier: `remind_anniversary_${item.id}`,
          content: {
            title: `Nhắc Lễ Giỗ: Còn ${item.remindDaysBefore} ngày nữa đến ${item.title}`,
            body: bodyText,
            data: {
              targetTab: 'month',
              solarYear: sAnnivYear,
              solarMonth: sAnnivMonth,
              solarDay: sAnnivDay,
              solarDateString: annivDateStr,
              url: annivUrl,
              anniversaryId: item.id,
              type: 'anniversary_reminder',
            },
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: remindDate,
          },
        });
      }

      // b. Đúng sáng ngày giỗ (lúc 07:00 sáng - CHỈ đặt lịch cho tương lai)
      const exactDate = new Date(item.nextSolarDate);
      exactDate.setHours(7, 0, 0, 0);
      if (exactDate.getTime() > now.getTime()) {
        await Notifications.scheduleNotificationAsync({
          identifier: `exact_anniversary_${item.id}`,
          content: {
            title: `Hôm nay là Ngày Giỗ: ${item.title}`,
            body: `Ngày ${item.lunarDay} Tháng ${item.lunarMonth} Âm lịch. Gia đình chuẩn bị hương hoa, lễ vật thành tâm dâng cúng.`,
            data: {
              targetTab: 'month',
              solarYear: sAnnivYear,
              solarMonth: sAnnivMonth,
              solarDay: sAnnivDay,
              solarDateString: annivDateStr,
              url: annivUrl,
              anniversaryId: item.id,
              type: 'anniversary_exact',
            },
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: exactDate,
          },
        });
      }
    }

    // 3. Quét 90 ngày tới để tìm đúng các ngày Lễ Tết, Rằm (15), Mùng 1 (1)
    for (let offset = 0; offset <= 90; offset++) {
      const targetDate = new Date(todayMidnight);
      targetDate.setDate(targetDate.getDate() + offset);

      const sDay = targetDate.getDate();
      const sMonth = targetDate.getMonth() + 1;
      const sYear = targetDate.getFullYear();
      const dateStr = `${sYear}-${String(sMonth).padStart(2, '0')}-${String(sDay).padStart(2, '0')}`;
      const dateUrl = `anlich://calendar?date=${dateStr}&tab=month`;

      const lunar = convertSolarToLunar(sDay, sMonth, sYear);
      const dayHolidays = getAllHolidaysForDay(sDay, sMonth, lunar.day, lunar.month);

      // --- TRƯỜNG HỢP 1: TẤT CẢ CÁC NGÀY LỄ TẾT (Cứ đến ngày lễ là gửi thông báo cho lễ đó) ---
      if (dayHolidays.length > 0) {
        for (const h of dayHolidays) {
          // a. Sáng ngày lễ lúc 07:15
          const morningHoliday = new Date(targetDate);
          morningHoliday.setHours(7, 15, 0, 0);

          if (morningHoliday.getTime() > now.getTime()) {
            await Notifications.scheduleNotificationAsync({
              identifier: `holiday_${h.isLunar ? 'lunar' : 'solar'}_${h.month}_${h.day}_${sYear}`,
              content: {
                title: `Hôm nay: ${h.title}`,
                body:
                  h.description ||
                  `Ngày ${sDay}/${sMonth} (Âm lịch: ${lunar.day}/${lunar.month}). Chúc bạn và gia đình một ngày lễ ý nghĩa, an lành và hạnh phúc!`,
                data: {
                  targetTab: 'month',
                  solarYear: sYear,
                  solarMonth: sMonth,
                  solarDay: sDay,
                  solarDateString: dateStr,
                  url: dateUrl,
                  type: 'holiday',
                  holidayTitle: h.title,
                },
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
                ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: morningHoliday,
              },
            });
          }

          // b. Chiều hôm trước ngày lễ lúc 18:00 (đối với các ngày lễ lớn / truyền thống quan trọng)
          if (h.isMajor || h.category === 'traditional') {
            const eveHoliday = new Date(targetDate);
            eveHoliday.setDate(eveHoliday.getDate() - 1);
            eveHoliday.setHours(18, 0, 0, 0);

            if (eveHoliday.getTime() > now.getTime()) {
              await Notifications.scheduleNotificationAsync({
                identifier: `eve_holiday_${h.isLunar ? 'lunar' : 'solar'}_${h.month}_${h.day}_${sYear}`,
                content: {
                  title: `Ngày mai: ${h.title}`,
                  body: `Ngày ${sDay}/${sMonth} (Âm lịch: ${lunar.day}/${lunar.month}). Gia đình chuẩn bị đón ${h.title} chu đáo và an lành.`,
                  data: {
                    targetTab: 'month',
                    solarYear: sYear,
                    solarMonth: sMonth,
                    solarDay: sDay,
                    solarDateString: dateStr,
                    url: dateUrl,
                    type: 'holiday_eve',
                    holidayTitle: h.title,
                  },
                  sound: 'default',
                  ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
                },
                trigger: {
                  type: Notifications.SchedulableTriggerInputTypes.DATE,
                  date: eveHoliday,
                },
              });
            }
          }
        }
      }

      // --- TRƯỜNG HỢP 2: NGÀY RẰM (15 Âm Lịch) THÔNG THƯỜNG ---
      // Nếu ngày này chưa có ngày lễ âm lịch riêng (để tránh gửi trùng 2 thông báo cùng một sáng)
      const hasLunarHoliday = dayHolidays.some((h) => h.isLunar);
      if (lunar.day === 15 && !hasLunarHoliday) {
        // Nhắc chiều hôm trước (14 âm) lúc 18:00
        const eveDate = new Date(targetDate);
        eveDate.setDate(eveDate.getDate() - 1);
        eveDate.setHours(18, 0, 0, 0);

        if (eveDate.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `eve_ram_${sYear}_${sMonth}_${sDay}`,
            content: {
              title: `Ngày mai là Rằm ${getLunarMonthName(lunar.month)}`,
              body: 'Gia chủ nhớ sắm sửa hương hoa tươi, ngũ quả dâng ban thờ Thần Linh và Gia Tiên.',
              data: {
                targetTab: 'month',
                solarYear: sYear,
                solarMonth: sMonth,
                solarDay: sDay,
                solarDateString: dateStr,
                url: dateUrl,
                type: 'ram',
              },
              sound: 'default',
              ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: eveDate,
            },
          });
        }

        // Báo sáng sớm ngày Rằm lúc 07:30
        const morningDate = new Date(targetDate);
        morningDate.setHours(7, 30, 0, 0);
        if (morningDate.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `morning_ram_${sYear}_${sMonth}_${sDay}`,
            content: {
              title: `Hôm nay là Ngày Rằm ${getLunarMonthName(lunar.month)} (Vọng)`,
              body: 'Kính chúc bạn và gia quyến một ngày rằm an vui, vạn sự thanh tịnh và cát lành.',
              data: {
                targetTab: 'month',
                solarYear: sYear,
                solarMonth: sMonth,
                solarDay: sDay,
                solarDateString: dateStr,
                url: dateUrl,
                type: 'ram',
              },
              sound: 'default',
              ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: morningDate,
            },
          });
        }
      }

      // --- TRƯỜNG HỢP 3: NGÀY MÙNG MỘT (1 Âm Lịch) THÔNG THƯỜNG ---
      // Nếu ngày này chưa có ngày lễ âm lịch riêng (ví dụ Mùng 1 Tết đã được gửi thông báo ở mục Lễ Tết)
      if (lunar.day === 1 && !hasLunarHoliday) {
        // Nhắc chiều hôm trước (30 hoặc 29 âm) lúc 18:00
        const eveDate = new Date(targetDate);
        eveDate.setDate(eveDate.getDate() - 1);
        eveDate.setHours(18, 0, 0, 0);

        if (eveDate.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `eve_mung1_${sYear}_${sMonth}_${sDay}`,
            content: {
              title: `Ngày mai là Mùng Một ${getLunarMonthName(lunar.month)}`,
              body: 'Gia chủ chuẩn bị hoa tươi, nước sạch, thắp hương cầu bình an cho tháng mới.',
              data: {
                targetTab: 'month',
                solarYear: sYear,
                solarMonth: sMonth,
                solarDay: sDay,
                solarDateString: dateStr,
                url: dateUrl,
                type: 'mung1',
              },
              sound: 'default',
              ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: eveDate,
            },
          });
        }

        // Báo sáng sớm Mùng 1 lúc 07:30
        const morningDate = new Date(targetDate);
        morningDate.setHours(7, 30, 0, 0);
        if (morningDate.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            identifier: `morning_mung1_${sYear}_${sMonth}_${sDay}`,
            content: {
              title: `Mùng Một Sớm Mai: Khởi đầu ${getLunarMonthName(lunar.month)}`,
              body: 'Chúc bạn một tháng mới công việc thuận buồm xuôi gió, tài lộc hanh thông!',
              data: {
                targetTab: 'month',
                solarYear: sYear,
                solarMonth: sMonth,
                solarDay: sDay,
                solarDateString: dateStr,
                url: dateUrl,
                type: 'mung1',
              },
              sound: 'default',
              ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: morningDate,
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn('Lỗi lập lịch thông báo quan trọng:', e);
  }
}

/**
 * GỬI THÔNG BÁO THỬ NGHIỆM TỨC THÌ
 */
export async function sendTestNotification(): Promise<void> {
  if (Platform.OS === 'web') return;

  await setupAndroidChannels();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Thử nghiệm: Nhắc lễ thành công!',
      body: 'Hệ thống đã sẵn sàng và CHỈ gửi thông báo vào đúng các dịp: Ngày Giỗ, Ngày Rằm, Mùng 1 và các ngày Lễ Tết lớn.',
      data: {
        targetTab: 'month',
        solarYear: now.getFullYear(),
        solarMonth: now.getMonth() + 1,
        solarDay: now.getDate(),
        solarDateString: todayStr,
        url: `anlich://calendar?date=${todayStr}&tab=month`,
        type: 'test',
      },
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.HIGH,
      ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
    },
    trigger: null,
  });
}
