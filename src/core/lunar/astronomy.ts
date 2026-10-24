/**
 * Thuật toán Thiên văn tính Lịch Âm Việt Nam (Múi giờ GMT+7)
 * Dựa trên công trình nghiên cứu và thuật toán của TS. Hồ Ngọc Đức
 */

export const VIETNAM_TIMEZONE = 7.0;

/**
 * Chuyển ngày/tháng/năm Dương lịch sang số ngày Julian (Julian Day Number)
 */
export function jdFromDate(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;
  if (jd < 2299161) {
    jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

/**
 * Chuyển số ngày Julian ngược lại ngày/tháng/năm Dương lịch
 */
export function jdToDate(jd: number): { day: number; month: number; year: number } {
  let a: number;
  let b: number;
  let c: number;
  let d: number;
  let e: number;
  let m: number;

  if (jd > 2299160) {
    a = jd + 32044;
    b = Math.floor((4 * a + 3) / 146097);
    c = a - Math.floor((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  d = Math.floor((4 * c + 3) / 1461);
  e = c - Math.floor((1461 * d) / 4);
  m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = b * 100 + d - 4800 + Math.floor(m / 10);

  return { day, month, year };
}

/**
 * Tính ngày Sóc (điểm Trăng Mới - New Moon) thứ k
 */
export function getNewMoonDay(k: number, timeZone = VIETNAM_TIMEZONE): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;

  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 -= 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(2 * dr * Mpr);
  C1 -= 0.0004 * Math.sin(3 * dr * Mpr);
  C1 += 0.0104 * Math.sin(2 * dr * F) - 0.0051 * Math.sin((M + Mpr) * dr);
  C1 -= 0.0074 * Math.sin((M - Mpr) * dr) + 0.0004 * Math.sin((2 * F + M) * dr);
  C1 -= 0.0004 * Math.sin((2 * F - M) * dr) - 0.0006 * Math.sin((2 * F + Mpr) * dr);
  C1 += 0.001 * Math.sin((2 * F - Mpr) * dr) + 0.0005 * Math.sin((2 * Mpr + M) * dr);

  let deltat: number;
  const approxYear = 1900 + Math.floor(k / 12.3685);
  if (approxYear < 1920) deltat = 0;
  else if (approxYear < 1950) deltat = 29.0;
  else if (approxYear < 1975) deltat = 45.0;
  else if (approxYear < 2000) deltat = 60.0;
  else if (approxYear < 2020) deltat = 69.0;
  else deltat = 75.0;

  const JdNew = Jd1 + C1 - deltat / 86400.0;
  return Math.floor(JdNew + 0.5 + timeZone / 24.0);
}

/**
 * Tính kinh độ mặt trời (Sun Longitude) tại ngày Julian quy định
 * Trả về góc từ 0 đến 11 đại diện cho các Trung khí
 */
export function getSunLongitude(dayNumber: number, timeZone = VIETNAM_TIMEZONE): number {
  const dr = Math.PI / 180;
  const T = (dayNumber - 2451545.5 - timeZone / 24.0) / 36525.0;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;

  let C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(dr * M);
  C += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  let theta = L0 + C;
  theta = theta * dr;
  theta = theta - Math.PI * 2 * Math.floor(theta / (Math.PI * 2));
  return Math.floor((theta / Math.PI) * 6);
}

/**
 * Tính góc kinh độ mặt trời thực tế từ 0 đến 360 độ để xác định chính xác 24 Tiết khí
 */
export function getExactSunLongitudeDegrees(dayNumber: number, timeZone = VIETNAM_TIMEZONE): number {
  const dr = Math.PI / 180;
  const T = (dayNumber - 2451545.5 - timeZone / 24.0) / 36525.0;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T * T - 0.00000048 * T * T * T;

  let C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(dr * M);
  C += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  let theta = (L0 + C) % 360;
  if (theta < 0) theta += 360;
  return theta;
}
