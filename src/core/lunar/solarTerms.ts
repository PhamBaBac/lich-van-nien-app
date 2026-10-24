/**
 * Danh sách 24 Tiết khí trong lịch thiên văn học phương Đông
 * Được xác định chính xác theo góc kinh độ mặt trời (15 độ một tiết khí)
 */

export const SOLAR_TERMS = [
  'Xuân Phân',  // 0°
  'Thanh Minh', // 15°
  'Cốc Vũ',     // 30°
  'Lập Hạ',     // 45°
  'Tiểu Mãn',   // 60°
  'Mang Chủng', // 75°
  'Hạ Chí',     // 90°
  'Tiểu Thử',   // 105°
  'Đại Thử',    // 120°
  'Lập Thu',    // 135°
  'Xử Thử',     // 150°
  'Bạch Lộ',    // 165°
  'Thu Phân',   // 180°
  'Hàn Lộ',     // 195°
  'Sương Giáng',// 210°
  'Lập Đông',   // 225°
  'Tiểu Tuyết', // 240°
  'Đại Tuyết',  // 255°
  'Đông Chí',   // 270°
  'Tiểu Hàn',   // 285°
  'Đại Hàn',    // 300°
  'Lập Xuân',   // 315°
  'Vũ Thủy',    // 330°
  'Kinh Trập',  // 345°
];

export function getSolarTerm(degrees: number): string {
  const index = Math.floor(degrees / 15) % 24;
  return SOLAR_TERMS[index] || 'Xuân Phân';
}
