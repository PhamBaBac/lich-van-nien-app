/**
 * Bát tự, Giờ Hoàng Đạo, Ngày Hoàng Đạo, Thập Nhị Trực và Hướng Xuất Hành
 */

import { ZodiacHour, DayFengShui } from '../types/lunar.types';
import { getSolarTermForDate } from '../lunar/converter';

export const ZODIAC_HOURS_TABLE: Record<number, number[]> = {
  // Dần (2), Thân (8): Tý, Sửu, Thìn, Tỵ, Mùi, Tuất
  2: [0, 1, 4, 5, 7, 10],
  8: [0, 1, 4, 5, 7, 10],
  // Mão (3), Dậu (9): Tý, Dần, Mão, Ngọ, Mùi, Dậu
  3: [0, 2, 3, 6, 7, 9],
  9: [0, 2, 3, 6, 7, 9],
  // Thìn (4), Tuất (10): Dần, Thìn, Tỵ, Thân, Dậu, Hợi
  4: [2, 4, 5, 8, 9, 11],
  10: [2, 4, 5, 8, 9, 11],
  // Tỵ (5), Hợi (11): Sửu, Thìn, Ngọ, Mùi, Tuất, Hợi
  5: [1, 4, 6, 7, 10, 11],
  11: [1, 4, 6, 7, 10, 11],
  // Tý (0), Ngọ (6): Tý, Sửu, Mão, Ngọ, Thân, Dậu
  0: [0, 1, 3, 6, 8, 9],
  6: [0, 1, 3, 6, 8, 9],
  // Sửu (1), Mùi (7): Dần, Mão, Tỵ, Thân, Tuất, Hợi
  1: [2, 3, 5, 8, 10, 11],
  7: [2, 3, 5, 8, 10, 11],
};

const HOUR_TIMES = [
  '23:00 - 00:59', // Tý
  '01:00 - 02:59', // Sửu
  '03:00 - 04:59', // Dần
  '05:00 - 06:59', // Mão
  '07:00 - 08:59', // Thìn
  '09:00 - 10:59', // Tỵ
  '11:00 - 12:59', // Ngọ
  '13:00 - 14:59', // Mùi
  '15:00 - 16:59', // Thân
  '17:00 - 18:59', // Dậu
  '19:00 - 20:59', // Tuất
  '21:00 - 22:59', // Hợi
];

const HOUR_BRANCH_NAMES = [
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

const ZODIAC_STARS = [
  'Thanh Long (Hoàng Đạo)',
  'Minh Đường (Hoàng Đạo)',
  'Thiên Hình (Hắc Đạo)',
  'Chu Tước (Hắc Đạo)',
  'Kim Quỹ (Hoàng Đạo)',
  'Bảo Quang (Hoàng Đạo)',
  'Bạch Hổ (Hắc Đạo)',
  'Ngọc Đường (Hoàng Đạo)',
  'Thiên Lao (Hắc Đạo)',
  'Huyền Vũ (Hắc Đạo)',
  'Tư Mệnh (Hoàng Đạo)',
  'Câu Trận (Hắc Đạo)',
];

const TRUC_NAMES = [
  { name: 'Kiến', desc: 'Tốt cho xuất hành, giá thú; kiêng động thổ, chôn cất' },
  { name: 'Trừ', desc: 'Tốt cho tắm gội, trị bệnh, xả xui; kiêng khai trương, ký kết' },
  { name: 'Mãn', desc: 'Tốt cho cầu tài lộc, mở cửa hàng; kiêng kiện tụng, tranh chấp' },
  { name: 'Bình', desc: 'Mọi việc bình hòa, nên tu sửa, may mặc; tránh mạo hiểm' },
  { name: 'Định', desc: 'Tốt cho ký kết hợp đồng, mua nhà đất; kiêng kiện cáo' },
  { name: 'Chấp', desc: 'Tốt cho gieo trồng, xây đắp; kiêng xuất tiền của lớn' },
  { name: 'Phá', desc: 'Nên dẹp bỏ việc cũ, phá dỡ; kiêng cưới hỏi, mở tiệm mới' },
  { name: 'Nguy', desc: 'Nên làm lễ cúng tế, cầu an; kiêng leo trèo, đi xa vùng hiểm trở' },
  { name: 'Thành', desc: 'Rất tốt cho cưới hỏi, nhập trạch, khai trương, thi cử' },
  { name: 'Thâu', desc: 'Tốt cho thu gom tài lộc, tích trữ, mua sắm vật quý' },
  { name: 'Khai', desc: 'Đại cát cho mở cửa hàng, xuất hành, nhập học, khởi công' },
  { name: 'Bế', desc: 'Tốt cho đắp đập, cất kho, ẩn giấu; kiêng khai trương, trị bệnh' },
];

const TWENTY_EIGHT_STARS = [
  { name: 'Sao Giác', quality: 'good' as const },
  { name: 'Sao Cang', quality: 'bad' as const },
  { name: 'Sao Đê', quality: 'bad' as const },
  { name: 'Sao Phòng', quality: 'good' as const },
  { name: 'Sao Tâm', quality: 'bad' as const },
  { name: 'Sao Vĩ', quality: 'good' as const },
  { name: 'Sao Cơ', quality: 'good' as const },
  { name: 'Sao Đẩu', quality: 'good' as const },
  { name: 'Sao Ngưu', quality: 'bad' as const },
  { name: 'Sao Nữ', quality: 'bad' as const },
  { name: 'Sao Hư', quality: 'bad' as const },
  { name: 'Sao Nguy', quality: 'bad' as const },
  { name: 'Sao Thất', quality: 'good' as const },
  { name: 'Sao Bích', quality: 'good' as const },
  { name: 'Sao Khuê', quality: 'bad' as const },
  { name: 'Sao Lâu', quality: 'good' as const },
  { name: 'Sao Vị', quality: 'good' as const },
  { name: 'Sao Mão', quality: 'bad' as const },
  { name: 'Sao Tất', quality: 'good' as const },
  { name: 'Sao Chủy', quality: 'bad' as const },
  { name: 'Sao Sâm', quality: 'good' as const },
  { name: 'Sao Tỉnh', quality: 'good' as const },
  { name: 'Sao Quỷ', quality: 'bad' as const },
  { name: 'Sao Liễu', quality: 'bad' as const },
  { name: 'Sao Tinh', quality: 'bad' as const },
  { name: 'Sao Trương', quality: 'good' as const },
  { name: 'Sao Dực', quality: 'good' as const },
  { name: 'Sao Chẩn', quality: 'good' as const },
];

/**
 * Trả về 12 giờ Can Chi trong ngày và phân định Hoàng Đạo / Hắc Đạo
 */
export function getDayZodiacHours(dayChiIndex: number): ZodiacHour[] {
  const zodiacIndices = ZODIAC_HOURS_TABLE[dayChiIndex] || [0, 1, 4, 5, 7, 10];
  const list: ZodiacHour[] = [];

  for (let i = 0; i < 12; i++) {
    const isZodiac = zodiacIndices.includes(i);
    list.push({
      branch: HOUR_BRANCH_NAMES[i],
      solarTime: HOUR_TIMES[i],
      isZodiac,
      zodiacName: isZodiac ? 'Hoàng Đạo' : 'Hắc Đạo',
      description: isZodiac
        ? 'Khung giờ cát lành, tốt cho việc quan trọng, xuất hành, cầu tài.'
        : 'Khung giờ bình hòa hoặc hắc đạo, nên làm việc nội bộ, cẩn trọng.',
    });
  }

  return list;
}

/**
 * Xác định ngày là Hoàng Đạo hay Hắc Đạo dựa theo Tháng Âm và Chi Ngày
 */
export function getDayZodiacStatus(
  lunarMonth: number,
  dayChiIndex: number
): { isZodiac: boolean; starName: string } {
  // Điểm khởi đầu của Thanh Long theo tháng âm (Tháng 1 & 7 khởi Tý; Tháng 2 & 8 khởi Dần...)
  const monthStartOffset: Record<number, number> = {
    1: 0,
    7: 0,
    2: 2,
    8: 2,
    3: 4,
    9: 4,
    4: 6,
    10: 6,
    5: 8,
    11: 8,
    6: 10,
    12: 10,
  };

  const start = monthStartOffset[lunarMonth] ?? 0;
  const starIndex = (dayChiIndex - start + 12) % 12;
  const starFullName = ZODIAC_STARS[starIndex];
  const isZodiac = starFullName.includes('Hoàng Đạo');

  return {
    isZodiac,
    starName: starFullName.split(' ')[0],
  };
}

/**
 * Lấy hướng xuất hành: Hỷ Thần và Tài Thần theo Can Ngày
 */
export function getDepartureDirections(dayCanIndex: number): { joyGod: string; wealthGod: string } {
  const JOY_GOD_DIRECTIONS = [
    'Đông Bắc', // Giáp
    'Tây Bắc',  // Ất
    'Tây Nam',  // Bính
    'Chính Nam',// Đinh
    'Đông Nam', // Mậu
    'Đông Bắc', // Kỷ
    'Tây Bắc',  // Canh
    'Tây Nam',  // Tân
    'Chính Nam',// Nhâm
    'Đông Nam', // Quý
  ];

  const WEALTH_GOD_DIRECTIONS = [
    'Đông Nam', // Giáp
    'Đông Nam', // Ất
    'Chính Đông',// Bính
    'Chính Đông',// Đinh
    'Chính Bắc', // Mậu
    'Chính Nam', // Kỷ
    'Tây Nam',  // Canh
    'Tây Nam',  // Tân
    'Chính Tây', // Nhâm
    'Chính Bắc', // Quý
  ];

  return {
    joyGod: JOY_GOD_DIRECTIONS[dayCanIndex] || 'Đông Nam',
    wealthGod: WEALTH_GOD_DIRECTIONS[dayCanIndex] || 'Chính Đông',
  };
}

/**
 * Tổng hợp thông tin Phong Thủy của một ngày
 */
export function getDayFengShui(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  lunarMonth: number,
  dayCanIndex: number,
  dayChiIndex: number
): DayFengShui {
  const zodiacStatus = getDayZodiacStatus(lunarMonth, dayChiIndex);
  const solarTerm = getSolarTermForDate(solarDay, solarMonth, solarYear);
  const directions = getDepartureDirections(dayCanIndex);

  // Tính Trực
  const trucIndex = (dayChiIndex - (lunarMonth + 1) + 24) % 12;
  const truc = TRUC_NAMES[trucIndex] || TRUC_NAMES[0];

  // Tính Nhị Thập Bát Tú
  const starItem = TWENTY_EIGHT_STARS[(solarDay + solarMonth * 2 + dayChiIndex) % 28];

  const suitable = zodiacStatus.isZodiac
    ? ['Cúng tế', 'Cầu an', 'Xuất hành', 'Mở cửa hàng', 'Khai trương', 'Gặp đối tác']
    : ['Nghỉ ngơi', 'Làm việc thiện', 'Dọn dẹp nhà cửa', 'Đọc sách'];

  const unsuitable = zodiacStatus.isZodiac
    ? ['Tranh cãi', 'Kiện tụng']
    : ['Động thổ', 'Khai trương lớn', 'Ký hợp đồng quan trọng', 'Đi xa đêm khuya'];

  return {
    isZodiacDay: zodiacStatus.isZodiac,
    zodiacName: zodiacStatus.starName,
    solarTerm,
    duty: truc.name,
    dutyDescription: truc.desc,
    star: starItem.name,
    starQuality: starItem.quality,
    suitable,
    unsuitable,
    directions,
  };
}
