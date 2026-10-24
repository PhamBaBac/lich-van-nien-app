/**
 * Danh mục các ngày lễ truyền thống Việt Nam và ngày lễ quan trọng
 */

export interface Holiday {
  title: string;
  isLunar: boolean;
  day: number;
  month: number;
}

export const HOLIDAYS: Holiday[] = [
  // Lễ Âm Lịch
  { title: 'Tết Nguyên Đán (Mùng 1 Tết)', isLunar: true, day: 1, month: 1 },
  { title: 'Tết Nguyên Đán (Mùng 2 Tết)', isLunar: true, day: 2, month: 1 },
  { title: 'Tết Nguyên Đán (Mùng 3 Tết)', isLunar: true, day: 3, month: 1 },
  { title: 'Tết Thượng Nguyên (Rằm Tháng Giêng)', isLunar: true, day: 15, month: 1 },
  { title: 'Tết Hàn Thực', isLunar: true, day: 3, month: 3 },
  { title: 'Giỗ Tổ Hùng Vương', isLunar: true, day: 10, month: 3 },
  { title: 'Lễ Phật Đản', isLunar: true, day: 15, month: 4 },
  { title: 'Tết Đoan Ngọ (Mùng 5 Tháng 5)', isLunar: true, day: 5, month: 5 },
  { title: 'Lễ Vu Lan & Xá Tội Vong Nhân (Rằm Tháng Bảy)', isLunar: true, day: 15, month: 7 },
  { title: 'Tết Trung Thu', isLunar: true, day: 15, month: 8 },
  { title: 'Tết Hạ Nguyên (Rằm Tháng Mười)', isLunar: true, day: 15, month: 10 },
  { title: 'Tết Ông Công Ông Táo', isLunar: true, day: 23, month: 12 },
  { title: 'Đêm Giao Thừa', isLunar: true, day: 30, month: 12 },

  // Lễ Dương Lịch
  { title: 'Tết Dương Lịch', isLunar: false, day: 1, month: 1 },
  { title: 'Ngày Thầy thuốc Việt Nam', isLunar: false, day: 27, month: 2 },
  { title: 'Ngày Quốc tế Phụ nữ', isLunar: false, day: 8, month: 3 },
  { title: 'Ngày Giải phóng Miền Nam', isLunar: false, day: 30, month: 4 },
  { title: 'Ngày Quốc tế Lao động', isLunar: false, day: 1, month: 5 },
  { title: 'Ngày Quốc tế Thiếu nhi', isLunar: false, day: 1, month: 6 },
  { title: 'Ngày Thương binh Liệt sĩ', isLunar: false, day: 27, month: 7 },
  { title: 'Ngày Cách mạng Tháng Tám', isLunar: false, day: 19, month: 8 },
  { title: 'Ngày Quốc Khánh Việt Nam', isLunar: false, day: 2, month: 9 },
  { title: 'Ngày Phụ nữ Việt Nam', isLunar: false, day: 20, month: 10 },
  { title: 'Ngày Nhà giáo Việt Nam', isLunar: false, day: 20, month: 11 },
  { title: 'Ngày Thành lập Quân đội Nhân dân', isLunar: false, day: 22, month: 12 },
];

export function getHoliday(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number
): string | undefined {
  const lunarH = HOLIDAYS.find(
    (h) => h.isLunar && h.day === lunarDay && h.month === lunarMonth
  );
  if (lunarH) return lunarH.title;

  const solarH = HOLIDAYS.find(
    (h) => !h.isLunar && h.day === solarDay && h.month === solarMonth
  );
  if (solarH) return solarH.title;

  // Đánh dấu ngày Rằm hoặc Mùng 1 nếu không trùng lễ khác
  if (lunarDay === 1) return 'Ngày Mùng Một (Sóc)';
  if (lunarDay === 15) return 'Ngày Rằm (Vọng)';

  return undefined;
}
