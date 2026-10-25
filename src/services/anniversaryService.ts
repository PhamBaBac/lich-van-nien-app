/**
 * Dịch vụ Quản lý & Tính toán Ngày Giỗ Âm Lịch sang Dương Lịch
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertLunarToSolar } from '../core';
import { LunarAnniversary, AnniversaryDisplayInfo } from '../core/types/event.types';

const STORAGE_KEY = '@an_lich_anniversaries_v1';

const DAY_NAMES = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const DEFAULT_ANNIVERSARIES: LunarAnniversary[] = [
  
];

/**
 * Tính toán ngày Dương lịch tương ứng kế tiếp cho một ngày Giỗ Âm lịch
 */
export function calculateNextOccurrence(
  anniversary: LunarAnniversary,
  referenceDate: Date = new Date()
): AnniversaryDisplayInfo {
  const currentYear = referenceDate.getFullYear();
  const todayMidnight = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  // 1. Quy đổi âm sang dương trong năm nay
  let solar = convertLunarToSolar(anniversary.lunarDay, anniversary.lunarMonth, currentYear);
  let nextSolarDate = new Date(solar.year, solar.month - 1, solar.day);

  // 2. Nếu ngày này trong năm nay đã trôi qua, tính cho năm kế tiếp
  if (nextSolarDate.getTime() < todayMidnight.getTime()) {
    solar = convertLunarToSolar(anniversary.lunarDay, anniversary.lunarMonth, currentYear + 1);
    nextSolarDate = new Date(solar.year, solar.month - 1, solar.day);
  }

  // 3. Tính khoảng cách số ngày còn lại
  const diffMs = nextSolarDate.getTime() - todayMidnight.getTime();
  const daysRemaining = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));

  let statusText = '';
  if (daysRemaining === 0) {
    statusText = 'HÔM NAY LÀ NGÀY GIỖ';
  } else if (daysRemaining === 1) {
    statusText = 'Ngày mai';
  } else {
    statusText = `Còn ${daysRemaining} ngày nữa`;
  }

  const dayOfWeek = DAY_NAMES[nextSolarDate.getDay()];
  const dayStr = nextSolarDate.getDate().toString().padStart(2, '0');
  const monthStr = (nextSolarDate.getMonth() + 1).toString().padStart(2, '0');
  const nextSolarString = `${dayOfWeek}, ${dayStr}/${monthStr}/${nextSolarDate.getFullYear()}`;

  return {
    ...anniversary,
    nextSolarDate,
    nextSolarString,
    daysRemaining,
    statusText,
    isUrgent: daysRemaining <= 7,
  };
}

/**
 * Lấy danh sách thô (LunarAnniversary[]) từ AsyncStorage
 */
export async function getRawAnniversaries(): Promise<LunarAnniversary[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return DEFAULT_ANNIVERSARIES;
  } catch {
    return DEFAULT_ANNIVERSARIES;
  }
}

/**
 * Lưu danh sách thô và trả về danh sách tính toán hiển thị
 */
export async function saveRawAnniversaries(
  list: LunarAnniversary[]
): Promise<AnniversaryDisplayInfo[]> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  const calculated = list.map((item) => calculateNextOccurrence(item));
  calculated.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return calculated;
}

export async function getAnniversaries(): Promise<AnniversaryDisplayInfo[]> {
  const raw = await getRawAnniversaries();
  const calculated = raw.map((item) => calculateNextOccurrence(item));
  calculated.sort((a, b) => a.daysRemaining - b.daysRemaining);
  return calculated;
}

/**
 * Lưu thêm một ngày giỗ mới
 */
export async function addAnniversary(
  item: Omit<LunarAnniversary, 'id' | 'createdAt'>
): Promise<AnniversaryDisplayInfo[]> {
  const currentList = await getAnniversaries();
  const newItem: LunarAnniversary = {
    ...item,
    id: `anniversary_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    createdAt: Date.now(),
  };

  const rawList: LunarAnniversary[] = currentList.map((i) => ({
    id: i.id,
    title: i.title,
    personName: i.personName,
    lunarDay: i.lunarDay,
    lunarMonth: i.lunarMonth,
    remindDaysBefore: i.remindDaysBefore,
    notes: i.notes,
    createdAt: i.createdAt,
  }));

  rawList.push(newItem);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rawList));

  return getAnniversaries();
}

/**
 * Xóa một ngày giỗ
 */
export async function deleteAnniversary(id: string): Promise<AnniversaryDisplayInfo[]> {
  const currentList = await getAnniversaries();
  const filtered = currentList.filter((item) => item.id !== id);

  const rawList: LunarAnniversary[] = filtered.map((i) => ({
    id: i.id,
    title: i.title,
    personName: i.personName,
    lunarDay: i.lunarDay,
    lunarMonth: i.lunarMonth,
    remindDaysBefore: i.remindDaysBefore,
    notes: i.notes,
    createdAt: i.createdAt,
  }));

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rawList));
  return getAnniversaries();
}
