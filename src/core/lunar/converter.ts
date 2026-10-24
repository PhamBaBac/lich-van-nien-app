/**
 * Bộ chuyển đổi Âm Dương Lịch Việt Nam
 * Dựa trên thuật toán thiên văn Hồ Ngọc Đức
 */

import {
  jdFromDate,
  jdToDate,
  getNewMoonDay,
  getSunLongitude,
  getExactSunLongitudeDegrees,
  VIETNAM_TIMEZONE,
} from './astronomy';
import { getSolarTerm } from './solarTerms';
import { LunarDate, SolarDate } from '../types/lunar.types';

/**
 * Tìm ngày Sóc bắt đầu tháng 11 Âm lịch của năm Dương lịch tương ứng
 * Tháng 11 Âm lịch luôn là tháng chứa tiết Đông Chí (Kinh độ mặt trời = 9)
 */
export function getLunarMonth11(year: number, timeZone = VIETNAM_TIMEZONE): number {
  const off = jdFromDate(31, 12, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone); // 9 = Dong Chi
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Tìm tháng nhuận trong năm âm lịch (nếu có)
 * Trả về tháng âm lịch được nhuận (ví dụ: tháng 4 nhuận trả về 4)
 * Trả về 0 nếu năm đó không có tháng nhuận
 */
export function getLeapMonthOffset(a11: number, timeZone = VIETNAM_TIMEZONE): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1; // Bắt đầu từ tháng sau tháng 11
  const arc: number[] = [];

  do {
    last = getNewMoonDay(k + i, timeZone);
    arc[i] = getSunLongitude(last, timeZone);
    i++;
  } while (arc[i - 1] !== arc[i - 2] && i < 14);

  return i - 1;
}

/**
 * Chuyển ngày Dương lịch sang ngày Âm lịch
 */
export function solarToLunar(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  timeZone = VIETNAM_TIMEZONE
): LunarDate {
  const dayNumber = jdFromDate(solarDay, solarMonth, solarYear);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }

  // Tìm tháng 11 của năm trước hoặc năm nay
  let a11 = getLunarMonth11(solarYear, timeZone);
  let b11 = a11;
  let lunarYear = solarYear;

  if (a11 >= monthStart) {
    lunarYear = solarYear;
    a11 = getLunarMonth11(solarYear - 1, timeZone);
  } else {
    lunarYear = solarYear + 1;
    b11 = getLunarMonth11(solarYear + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let isLeapMonth = false;
  let lunarMonth = diff + 11;

  // Kiểm tra năm có 13 tháng (năm nhuận)
  if (b11 - a11 > 365) {
    const leapOffset = getLeapMonthOffset(a11, timeZone);
    const leapMonthIndex = diff >= leapOffset ? diff - 1 : diff;
    if (diff === leapOffset) {
      isLeapMonth = true;
    }
    lunarMonth = leapMonthIndex + 11;
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    isLeapMonth,
  };
}

/**
 * Chuyển ngày Âm lịch sang ngày Dương lịch
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth = false,
  timeZone = VIETNAM_TIMEZONE
): SolarDate {
  let a11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
  }

  const b11 = getLunarMonth11(lunarYear, timeZone);
  let k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOffset = getLeapMonthOffset(a11, timeZone);
    let m = off;
    if (isLeapMonth) {
      m = leapOffset;
    } else if (off >= leapOffset) {
      m = off + 1;
    }
    k += m;
  } else {
    k += off;
  }

  const monthStart = getNewMoonDay(k, timeZone);
  return jdToDate(monthStart + lunarDay - 1);
}

/**
 * Lấy tên tháng âm lịch truyền thống (Tháng Giêng, Tháng Chạp, ...)
 */
export function getLunarMonthName(month: number, isLeapMonth = false): string {
  const names = [
    '',
    'Giêng',
    'Hai',
    'Ba',
    'Tư',
    'Năm',
    'Sáu',
    'Bảy',
    'Tám',
    'Chín',
    'Mười',
    'Mười Một',
    'Chạp',
  ];
  const name = names[month] || `${month}`;
  return isLeapMonth ? `Tháng ${name} (Nhuận)` : `Tháng ${name}`;
}

/**
 * Lấy Tiết khí của ngày chỉ định
 */
export function getSolarTermForDate(day: number, month: number, year: number): string {
  const jd = jdFromDate(day, month, year);
  const degrees = getExactSunLongitudeDegrees(jd);
  return getSolarTerm(degrees);
}
