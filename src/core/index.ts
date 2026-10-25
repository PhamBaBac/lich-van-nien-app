/**
 * Entry point cho toàn bộ Lõi Thiên Văn & Lịch Âm Dương (Core Engine)
 */

import { solarToLunar, lunarToSolar, getLunarMonthName } from './lunar/converter';
import { getDayCanChi, getFullCanChi } from './canchi/canChiCalculator';
import { getDayFengShui, getDayZodiacHours } from './fengshui/zodiacHours';
import { getQuoteForDay } from '../data/quotes';
import { getHoliday } from '../data/holidays';
import { FullDayData, SolarDate, LunarDate } from './types/lunar.types';

const DAY_OF_WEEK_NAMES = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const DAY_OF_WEEK_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Trả về toàn bộ dữ liệu âm dương, phong thủy, giờ hoàng đạo của một ngày
 */
export function getFullDayData(date: Date = new Date()): FullDayData {
  const solarDay = date.getDate();
  const solarMonth = date.getMonth() + 1;
  const solarYear = date.getFullYear();
  const dayOfWeekIndex = date.getDay();
  const currentHour = date.getHours();

  // 1. Tính ngày âm
  const lunar = solarToLunar(solarDay, solarMonth, solarYear);
  const lunarMonthName = getLunarMonthName(lunar.month, lunar.isLeapMonth);

  // 2. Tính Can Chi
  const dayCC = getDayCanChi(solarDay, solarMonth, solarYear);
  const canChi = getFullCanChi(
    solarDay,
    solarMonth,
    solarYear,
    lunar.month,
    lunar.year,
    currentHour
  );

  // 3. Tính Phong Thủy & Giờ Hoàng Đạo
  const fengShui = getDayFengShui(
    solarDay,
    solarMonth,
    solarYear,
    lunar.month,
    dayCC.canIndex,
    dayCC.chiIndex
  );
  const zodiacHours = getDayZodiacHours(dayCC.chiIndex);

  // 4. Danh ngôn & Ngày Lễ
  const normalizedDate = new Date(solarYear, solarMonth - 1, solarDay, 12, 0, 0);
  const startOfYear = new Date(solarYear, 0, 0, 12, 0, 0);
  const dayOfYear = Math.round(
    (normalizedDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
  );
  const quote = getQuoteForDay(dayOfYear);
  const holiday = getHoliday(solarDay, solarMonth, lunar.day, lunar.month);

  const today = new Date();
  const isToday =
    today.getDate() === solarDay &&
    today.getMonth() + 1 === solarMonth &&
    today.getFullYear() === solarYear;

  return {
    solar: {
      day: solarDay,
      month: solarMonth,
      year: solarYear,
      dayOfWeek: DAY_OF_WEEK_NAMES[dayOfWeekIndex],
      dayOfWeekShort: DAY_OF_WEEK_SHORT[dayOfWeekIndex],
      isToday,
    },
    lunar: {
      ...lunar,
      monthName: lunarMonthName,
    },
    canChi,
    fengShui,
    zodiacHours,
    quote,
    holiday,
  };
}

/**
 * Chuyển đổi nhanh Dương sang Âm
 */
export function convertSolarToLunar(day: number, month: number, year: number): LunarDate {
  return solarToLunar(day, month, year);
}

/**
 * Chuyển đổi nhanh Âm sang Dương
 */
export function convertLunarToSolar(
  day: number,
  month: number,
  year: number,
  isLeapMonth = false
): SolarDate {
  return lunarToSolar(day, month, year, isLeapMonth);
}

export { getLunarMonthName, getLunarLeapMonth } from './lunar/converter';
export { getDayCanChi } from './canchi/canChiCalculator';
export { getDayZodiacStatus } from './fengshui/zodiacHours';
export {
  getHoliday,
  getHolidayDetails,
  getAllHolidaysForDay,
  isMajorHoliday,
  HOLIDAYS,
  Holiday,
  HolidayCategory,
} from '../data/holidays';
export * from './types/lunar.types';
