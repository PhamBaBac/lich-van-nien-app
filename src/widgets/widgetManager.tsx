import React from 'react';
import { Platform, NativeModules } from 'react-native';
import {
  requestWidgetUpdate,
  requestPinWidget,
} from 'react-native-android-widget';
import { getFullDayData } from '../core';
import { LichNgayWidget } from './LichNgayWidget';
import { LichChiTietWidget } from './LichChiTietWidget';

/**
 * Kiểm tra xem môi trường hiện tại có hỗ trợ native widget hay không
 * (Tránh gọi lệnh khi đang chạy trong Expo Go)
 */
export function isAndroidWidgetSupported(): boolean {
  if (Platform.OS !== 'android') return false;
  try {
    // @ts-expect-error
    const isTurbo = global.__turboModuleProxy != null;
    if (isTurbo) {
      // @ts-expect-error
      const mod = global.__turboModuleProxy('AndroidWidget');
      return mod != null;
    }
    return NativeModules?.AndroidWidget != null;
  } catch {
    return false;
  }
}

/**
 * Cập nhật tất cả các Widget đã được ghim trên màn hình chính Android
 */
export async function updateAllAndroidWidgets(): Promise<void> {
  if (!isAndroidWidgetSupported()) return;

  try {
    const todayData = getFullDayData(new Date());

    // Cập nhật Widget Lịch Ngày 2x2
    await requestWidgetUpdate({
      widgetName: 'LichNgay',
      renderWidget: () => ({
        light: <LichNgayWidget data={todayData} isDark={false} />,
        dark: <LichNgayWidget data={todayData} isDark={true} />,
      }),
      widgetNotFound: () => {},
    }).catch(() => {});

    // Cập nhật Widget Lịch Chi Tiết 4x2
    await requestWidgetUpdate({
      widgetName: 'LichChiTiet',
      renderWidget: () => ({
        light: <LichChiTietWidget data={todayData} isDark={false} />,
        dark: <LichChiTietWidget data={todayData} isDark={true} />,
      }),
      widgetNotFound: () => {},
    }).catch(() => {});
  } catch (error) {
    console.warn('Lỗi khi cập nhật Android widgets:', error);
  }
}

/**
 * Yêu cầu hệ thống Android hiển thị hộp thoại ghim Widget ra màn hình chính
 */
export async function pinAndroidWidget(
  widgetName: 'LichNgay' | 'LichChiTiet'
): Promise<boolean> {
  if (!isAndroidWidgetSupported()) return false;

  try {
    return await requestPinWidget({ widgetName });
  } catch (error) {
    console.warn(`Lỗi khi ghim widget ${widgetName}:`, error);
    return false;
  }
}
