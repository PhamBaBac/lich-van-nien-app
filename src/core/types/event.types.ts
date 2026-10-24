/**
 * Định nghĩa kiểu dữ liệu cho Sự kiện & Ngày Giỗ Âm Lịch
 */

export interface LunarAnniversary {
  id: string;
  title: string;              // "Giỗ Cụ Cố Nội", "Giỗ Bác Hai"
  personName?: string;        // Tên người quá cố
  lunarDay: number;           // Ngày âm: 1 - 30
  lunarMonth: number;         // Tháng âm: 1 - 12
  remindDaysBefore: number;   // Nhắc trước 1, 3, hoặc 7 ngày
  notes?: string;             // Danh sách chuẩn bị mâm lễ, phân công
  createdAt: number;
}

export interface AnniversaryDisplayInfo extends LunarAnniversary {
  nextSolarDate: Date;
  nextSolarString: string;    // "Thứ Năm, 24/09/2026"
  daysRemaining: number;      // Số ngày còn lại
  statusText: string;         // "Hôm nay là ngày giỗ", "Còn 3 ngày nữa"
  isUrgent: boolean;          // true nếu trong vòng 7 ngày tới
}
