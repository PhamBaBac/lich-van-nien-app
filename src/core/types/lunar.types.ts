/**
 * Type definitions for Vietnamese Lunar-Solar Calendar Engine
 */

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
  leapMonth?: number; // Tháng nhuận trong năm nếu có
}

export interface CanChiDate {
  yearCanChi: string;   // Ví dụ: Bính Ngọ
  monthCanChi: string;  // Ví dụ: Mậu Tuất
  dayCanChi: string;    // Ví dụ: Canh Thân
  hourCanChi: string;   // Ví dụ: Bính Tý
  element: string;      // Ngũ hành nạp âm (Ví dụ: Thạch Lựu Mộc)
}

export interface ZodiacHour {
  branch: string;       // Tý, Sửu, Dần...
  solarTime: string;    // 23:00 - 00:59
  isZodiac: boolean;    // true: Hoàng đạo | false: Hắc đạo
  zodiacName: string;   // Thanh Long, Minh Đường...
  description: string;  // Tốt cho việc gì
}

export interface DayFengShui {
  isZodiacDay: boolean; // Ngày Hoàng đạo hay Hắc đạo
  zodiacName: string;   // Tên sao trực nhật (Thanh Long, Câu Trận...)
  solarTerm: string;    // Tiết khí: Lập Xuân, Sương Giáng...
  duty: string;         // Thập nhị Trực: Kiến, Trừ, Mãn...
  dutyDescription: string;
  star: string;         // Nhị thập bát tú: Sao Giác, Sao Cang...
  starQuality: 'good' | 'bad' | 'neutral';
  suitable: string[];   // Việc nên làm
  unsuitable: string[]; // Việc nên kiêng
  directions: {
    joyGod: string;     // Hướng Hỷ Thần
    wealthGod: string;  // Hướng Tài Thần
  };
}

export interface FullDayData {
  solar: SolarDate & {
    dayOfWeek: string;
    dayOfWeekShort: string;
    isToday: boolean;
  };
  lunar: LunarDate & {
    monthName: string;
  };
  canChi: CanChiDate;
  fengShui: DayFengShui;
  zodiacHours: ZodiacHour[];
  quote: {
    content: string;
    author: string;
  };
  holiday?: string;
}
