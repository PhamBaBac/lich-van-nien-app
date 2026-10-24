/**
 * Bộ tính Can Chi và Ngũ Hành Nạp Âm
 */

import { jdFromDate } from '../lunar/astronomy';
import { CanChiDate } from '../types/lunar.types';

export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const CHI = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
];

// 60 Hoa Giáp Ngũ Hành Nạp Âm
const LUC_THAP_HOA_GIAP_MENH: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim',
  'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa',
  'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc',
  'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ',
  'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim',
  'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa',
  'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy',
  'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ',
  'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim',
  'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc',
  'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy',
  'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ',
  'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa',
  'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc',
  'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy',
  'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim',
  'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa',
  'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc',
  'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ',
  'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim',
  'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phú Đăng Hỏa',
  'Ất Tỵ': 'Phú Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy',
  'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Trạch Thổ',
  'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim',
  'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc',
  'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy',
  'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ',
  'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa',
  'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc',
  'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy',
  'Quý Hợi': 'Đại Hải Thủy',
};

/**
 * Tính Can Chi của Năm Âm Lịch
 */
export function getYearCanChi(lunarYear: number): { can: string; chi: string; full: string } {
  const canIndex = (lunarYear + 6) % 10;
  const chiIndex = (lunarYear + 8) % 12;
  const can = CAN[canIndex];
  const chi = CHI[chiIndex];
  return { can, chi, full: `${can} ${chi}` };
}

/**
 * Tính Can Chi của Ngày (Dựa trên số ngày Julian của ngày Dương lịch tương ứng)
 */
export function getDayCanChi(
  solarDay: number,
  solarMonth: number,
  solarYear: number
): { can: string; chi: string; full: string; canIndex: number; chiIndex: number } {
  const jd = jdFromDate(solarDay, solarMonth, solarYear);
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;
  const can = CAN[canIndex];
  const chi = CHI[chiIndex];
  return { can, chi, full: `${can} ${chi}`, canIndex, chiIndex };
}

/**
 * Tính Can Chi của Tháng Âm Lịch (Quy tắc Ngũ Hổ Độn)
 */
export function getMonthCanChi(
  lunarMonth: number,
  lunarYear: number
): { can: string; chi: string; full: string } {
  const yearCanIndex = (lunarYear + 6) % 10;
  // Chi của tháng âm: Tháng Giêng = Dần (2), Tháng 2 = Mão (3), ..., Tháng 12 = Sửu (1)
  const chiIndex = (lunarMonth + 1) % 12;
  const chi = CHI[chiIndex];

  // Can tháng Giêng khởi theo can năm
  const firstMonthCan = (yearCanIndex % 5) * 2 + 2;
  const canIndex = (firstMonthCan + (lunarMonth - 1)) % 10;
  const can = CAN[canIndex];

  return { can, chi, full: `${can} ${chi}` };
}

/**
 * Tính Can Chi của Giờ theo Can của Ngày (Quy tắc Ngũ Thử Độn)
 */
export function getHourCanChi(
  hourBranchIndex: number, // 0 = Tý, 1 = Sửu...
  dayCanIndex: number
): { can: string; chi: string; full: string } {
  const startCan = (dayCanIndex % 5) * 2;
  const canIndex = (startCan + hourBranchIndex) % 10;
  const can = CAN[canIndex];
  const chi = CHI[hourBranchIndex];
  return { can, chi, full: `${can} ${chi}` };
}

/**
 * Tra cứu Ngũ Hành Nạp Âm của một cặp Can Chi
 */
export function getNapAmElement(canChiName: string): string {
  return LUC_THAP_HOA_GIAP_MENH[canChiName] || 'Bình Địa Mộc';
}

/**
 * Trả về đầy đủ Can Chi Ngày, Tháng, Năm, Giờ
 */
export function getFullCanChi(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  lunarMonth: number,
  lunarYear: number,
  currentHour = 12
): CanChiDate {
  const yearCC = getYearCanChi(lunarYear);
  const monthCC = getMonthCanChi(lunarMonth, lunarYear);
  const dayCC = getDayCanChi(solarDay, solarMonth, solarYear);

  // Xác định chi của giờ hiện tại (23h - 0h59 là giờ Tý = 0, 1h - 2h59 là Sửu = 1...)
  const hourBranchIndex = Math.floor((currentHour + 1) / 2) % 12;
  const hourCC = getHourCanChi(hourBranchIndex, dayCC.canIndex);

  return {
    yearCanChi: yearCC.full,
    monthCanChi: monthCC.full,
    dayCanChi: dayCC.full,
    hourCanChi: hourCC.full,
    element: getNapAmElement(dayCC.full),
  };
}
