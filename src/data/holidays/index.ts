/**
 * Danh mục toàn diện các ngày lễ lớn nhỏ truyền thống & hiện đại của Việt Nam
 */

export type HolidayCategory =
  | 'traditional'    // Lễ Tết Âm lịch truyền thống, dân gian
  | 'national'       // Quốc lễ, ngày kỷ niệm lịch sử dân tộc
  | 'cultural'       // Ngày lễ văn hóa, tôn giáo, ngành nghề
  | 'international'; // Ngày lễ quốc tế phổ biến tại Việt Nam

export interface Holiday {
  title: string;
  isLunar: boolean;
  day: number;
  month: number;
  isMajor?: boolean;
  category: HolidayCategory;
  description?: string;
}

export const HOLIDAYS: Holiday[] = [
  // ==========================================
  // I. CÁC NGÀY LỄ / TẾT ÂM LỊCH (LUNAR CALENDAR)
  // ==========================================
  // Tháng Giêng (Tháng 1 Âm)
  {
    title: 'Tết Nguyên Đán (Mùng 1 Tết)',
    isLunar: true,
    day: 1,
    month: 1,
    isMajor: true,
    category: 'traditional',
    description: 'Khởi đầu năm mới, dâng hương lễ Phật, chúc Tết gia đình và ông bà tổ tiên.',
  },
  {
    title: 'Tết Nguyên Đán (Mùng 2 Tết)',
    isLunar: true,
    day: 2,
    month: 1,
    isMajor: true,
    category: 'traditional',
    description: 'Tết bên ngoại, du xuân chúc Tết họ hàng, bạn bè và đón lộc đầu năm.',
  },
  {
    title: 'Tết Nguyên Đán (Mùng 3 Tết)',
    isLunar: true,
    day: 3,
    month: 1,
    isMajor: true,
    category: 'traditional',
    description: 'Mùng ba Tết thầy, lễ tạ hóa vàng tiễn đưa tổ tiên sau những ngày đón Tết sum vầy.',
  },
  {
    title: 'Tết Nguyên Đán (Mùng 4 Tết)',
    isLunar: true,
    day: 4,
    month: 1,
    isMajor: false,
    category: 'traditional',
    description: 'Khai xuân mở cửa hàng, đón lộc xuân và chuẩn bị công việc năm mới.',
  },
  {
    title: 'Lễ hội Gò Đống Đa',
    isLunar: true,
    day: 5,
    month: 1,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm chiến thắng Ngọc Hồi - Đống Đa oanh liệt của vua Quang Trung mùa xuân 1789.',
  },
  {
    title: 'Ngày Vía Thần Tài',
    isLunar: true,
    day: 10,
    month: 1,
    isMajor: true,
    category: 'traditional',
    description: 'Mùng 10 tháng Giêng: Cúng vía Thần Tài, mua vàng cầu tài lộc buôn bán hanh thông.',
  },
  {
    title: 'Tết Thượng Nguyên (Rằm Tháng Giêng)',
    isLunar: true,
    day: 15,
    month: 1,
    isMajor: true,
    category: 'traditional',
    description: 'Tết Nguyên Tiêu, đêm rằm đầu tiên trong năm: "Lễ Phật quanh năm không bằng Rằm tháng Giêng".',
  },

  // Tháng Hai Âm
  {
    title: 'Lễ hội Đền Hai Bà Trưng',
    isLunar: true,
    day: 6,
    month: 2,
    isMajor: false,
    category: 'national',
    description: 'Tưởng nhớ công đức Hai Bà Trưng dấy cờ khởi nghĩa giành độc lập cho bờ cõi.',
  },
  {
    title: 'Lễ Vía Quán Thế Âm Bồ Tát (Đản sinh)',
    isLunar: true,
    day: 19,
    month: 2,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Đản sinh của Đức Quán Thế Âm Bồ Tát từ bi cứu khổ cứu nạn.',
  },

  // Tháng Ba Âm
  {
    title: 'Tết Hàn Thực',
    isLunar: true,
    day: 3,
    month: 3,
    isMajor: true,
    category: 'traditional',
    description: 'Ngày bánh trôi bánh chay, tưởng nhớ cội nguồn tiên tổ và sum họp gia đình.',
  },
  {
    title: 'Giỗ Tổ Hùng Vương',
    isLunar: true,
    day: 10,
    month: 3,
    isMajor: true,
    category: 'national',
    description: 'Quốc lễ Đền Hùng: "Dù ai đi ngược về xuôi / Nhớ ngày Giỗ Tổ mùng mười tháng ba".',
  },

  // Tháng Tư Âm
  {
    title: 'Lễ Phật Đản Cổ Truyền',
    isLunar: true,
    day: 8,
    month: 4,
    isMajor: false,
    category: 'cultural',
    description: 'Nghi thức Tắm Phật truyền thống theo phong tục Phật giáo cổ xưa.',
  },
  {
    title: 'Đại Lễ Phật Đản (Vesak)',
    isLunar: true,
    day: 15,
    month: 4,
    isMajor: true,
    category: 'cultural',
    description: 'Rằm Tháng Tư: Kỷ niệm Đức Phật Thích Ca Mâu Ni đản sinh mang lại ánh sáng từ bi.',
  },
  {
    title: 'Lễ hội Vía Bà Chúa Xứ Núi Sam',
    isLunar: true,
    day: 23,
    month: 4,
    isMajor: false,
    category: 'traditional',
    description: 'Lễ hội tín ngưỡng dân gian lớn bậc nhất Nam Bộ tại Châu Đốc, An Giang.',
  },

  // Tháng Năm Âm
  {
    title: 'Tết Đoan Ngọ (Mùng 5 Tháng 5)',
    isLunar: true,
    day: 5,
    month: 5,
    isMajor: true,
    category: 'traditional',
    description: 'Tết giết sâu bọ, tục ăn cơm rượu nếp, hoa quả vị chua chát để trừ tà tẩy uế.',
  },

  // Tháng Sáu Âm
  {
    title: 'Lễ Vía Quán Thế Âm Thành Đạo',
    isLunar: true,
    day: 19,
    month: 6,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Đức Quán Thế Âm Bồ Tát chứng ngộ quả vị cứu độ muôn loài.',
  },

  // Tháng Bảy Âm
  {
    title: 'Lễ Thất Tịch',
    isLunar: true,
    day: 7,
    month: 7,
    isMajor: false,
    category: 'traditional',
    description: 'Ngày Ngưu Lang - Chức Nữ trùng phùng nơi cầu Ô Thước, phong tục ăn chè đậu đỏ.',
  },
  {
    title: 'Đại Lễ Vu Lan Báo Hiếu & Xá Tội Vong Nhân',
    isLunar: true,
    day: 15,
    month: 7,
    isMajor: true,
    category: 'traditional',
    description: 'Rằm Tháng Bảy: Đạo hiếu tri ân công đức sinh thành cha mẹ và cúng thí thực phổ độ cô hồn.',
  },
  {
    title: 'Lễ Vía Địa Tạng Vương Bồ Tát',
    isLunar: true,
    day: 30,
    month: 7,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Đức Địa Tạng Vương Bồ Tát phát đại nguyện cứu vớt chúng sinh nơi cõi u minh.',
  },

  // Tháng Tám Âm
  {
    title: 'Tết Trung Thu (Rằm Tháng Tám)',
    isLunar: true,
    day: 15,
    month: 8,
    isMajor: true,
    category: 'traditional',
    description: 'Tết Đoàn Viên, đêm hội rước đèn ngắm trăng phá cỗ và thưởng trà bánh nướng bánh dẻo.',
  },
  {
    title: 'Giỗ Đức Thánh Trần',
    isLunar: true,
    day: 20,
    month: 8,
    isMajor: false,
    category: 'national',
    description: 'Tưởng nhớ ngày mất của Quốc công Tiết chế Hưng Đạo Đại Vương Trần Quốc Tuấn: "Tháng Tám giỗ Cha".',
  },

  // Tháng Chín Âm
  {
    title: 'Tết Trùng Cửu (Song Cửu)',
    isLunar: true,
    day: 9,
    month: 9,
    isMajor: false,
    category: 'traditional',
    description: 'Tết số 9 may mắn, phong tục leo núi ngắm cảnh, thưởng hoa cúc và uống trà thanh tịnh.',
  },
  {
    title: 'Lễ Vía Quán Thế Âm Xuất Gia',
    isLunar: true,
    day: 19,
    month: 9,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Đức Bồ Tát Quán Thế Âm phát tâm từ bỏ vinh hoa để xuất gia tu đạo.',
  },

  // Tháng Mười Âm
  {
    title: 'Tết Trùng Thập (Tết Thầy Thuốc)',
    isLunar: true,
    day: 10,
    month: 10,
    isMajor: false,
    category: 'traditional',
    description: 'Ngày lễ tạ ơn các vị lương y thần dược và ăn Tết Cơm Mới mừng vụ mùa gặt hái no đủ.',
  },
  {
    title: 'Tết Hạ Nguyên (Rằm Tháng Mười)',
    isLunar: true,
    day: 15,
    month: 10,
    isMajor: false,
    category: 'traditional',
    description: 'Lễ Tạ Ơn Thần Nông và cầu mùa, tạ phúc cho gia đình một năm tai qua nạn khỏi.',
  },

  // Tháng Chạp (Tháng 12 Âm)
  {
    title: 'Lễ Phật Thành Đạo',
    isLunar: true,
    day: 8,
    month: 12,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm Đức Thích Ca Mâu Ni đại ngộ thành Phật dưới bóng cội bồ đề thiêng.',
  },
  {
    title: 'Tết Ông Công Ông Táo',
    isLunar: true,
    day: 23,
    month: 12,
    isMajor: true,
    category: 'traditional',
    description: 'Lễ phóng sinh cá chép, tiễn Táo Quân chầu trời báo cáo việc tốt xấu của trần gian trong năm.',
  },
  {
    title: 'Ngày 29 Tết (Chuẩn bị Tất Niên)',
    isLunar: true,
    day: 29,
    month: 12,
    isMajor: false,
    category: 'traditional',
    description: 'Gia đình sửa soạn mâm ngũ quả, dọn dẹp ban thờ và sum vầy chuẩn bị đón xuân.',
  },
  {
    title: 'Đêm Giao Thừa (Lễ Trừ Tịch)',
    isLunar: true,
    day: 30,
    month: 12,
    isMajor: true,
    category: 'traditional',
    description: 'Lễ cúng Giao Thừa tống cựu nghênh tân, khoảnh khắc thiêng liêng đất trời chuyển giao năm mới.',
  },

  // ==========================================
  // II. CÁC NGÀY LỄ / KỶ NIỆM DƯƠNG LỊCH (SOLAR)
  // ==========================================
  // Tháng 1
  {
    title: 'Tết Dương Lịch (Năm Mới)',
    isLunar: false,
    day: 1,
    month: 1,
    isMajor: true,
    category: 'national',
    description: 'Ngày đầu tiên của năm mới Dương lịch trên toàn thế giới, ngày nghỉ lễ chính thức.',
  },
  {
    title: 'Ngày Học sinh, Sinh viên Việt Nam',
    isLunar: false,
    day: 9,
    month: 1,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm ngày truyền thống hào hùng của học sinh, sinh viên noi gương anh Trần Văn Ơn (1950).',
  },

  // Tháng 2
  {
    title: 'Ngày Thành lập Đảng Cộng sản Việt Nam',
    isLunar: false,
    day: 3,
    month: 2,
    isMajor: true,
    category: 'national',
    description: 'Kỷ niệm ngày thành lập Đảng Cộng sản Việt Nam (03/02/1930).',
  },
  {
    title: 'Lễ Tình nhân (Valentine)',
    isLunar: false,
    day: 14,
    month: 2,
    isMajor: false,
    category: 'international',
    description: 'Ngày lễ tôn vinh tình yêu lứa đôi ngọt ngào, trao gửi socola và thiệp mừng.',
  },
  {
    title: 'Ngày Thầy thuốc Việt Nam',
    isLunar: false,
    day: 27,
    month: 2,
    isMajor: false,
    category: 'cultural',
    description: 'Tôn vinh và tri ân các y bác sĩ, nhân viên ngành y tế cống hiến vì sức khỏe nhân dân.',
  },

  // Tháng 3
  {
    title: 'Ngày Quốc tế Phụ nữ',
    isLunar: false,
    day: 8,
    month: 3,
    isMajor: true,
    category: 'international',
    description: 'Tôn vinh quyền bình đẳng, sự hy sinh và vẻ đẹp dịu dàng của người phụ nữ.',
  },
  {
    title: 'Ngày Quốc tế Hạnh phúc',
    isLunar: false,
    day: 20,
    month: 3,
    isMajor: false,
    category: 'international',
    description: 'Lan tỏa năng lượng tích cực, yêu thương và sẻ chia niềm vui trong cuộc sống.',
  },
  {
    title: 'Ngày Thành lập Đoàn TNCS Hồ Chí Minh',
    isLunar: false,
    day: 26,
    month: 3,
    isMajor: false,
    category: 'national',
    description: 'Ngày truyền thống của thế hệ trẻ xung kích, năng động xây dựng quê hương (1931).',
  },
  {
    title: 'Ngày Thể thao Việt Nam',
    isLunar: false,
    day: 27,
    month: 3,
    isMajor: false,
    category: 'cultural',
    description: 'Khuyến khích toàn dân rèn luyện thân thể theo gương Bác Hồ vĩ đại.',
  },
  {
    title: 'Ngày Truyền thống Dân quân Tự vệ',
    isLunar: false,
    day: 28,
    month: 3,
    isMajor: false,
    category: 'national',
    description: 'Tôn vinh lực lượng vũ trang quần chúng kiên cường bảo vệ làng xóm, quê hương.',
  },

  // Tháng 4
  {
    title: 'Ngày Cá Tháng Tư',
    isLunar: false,
    day: 1,
    month: 4,
    isMajor: false,
    category: 'international',
    description: 'Ngày nói đùa vui vẻ mang lại tiếng cười sảng khoái và thư giãn tinh thần.',
  },
  {
    title: 'Ngày Văn hóa các Dân tộc Việt Nam',
    isLunar: false,
    day: 19,
    month: 4,
    isMajor: false,
    category: 'cultural',
    description: 'Tôn vinh và phát huy bản sắc văn hóa đặc sắc của 54 dân tộc anh em.',
  },
  {
    title: 'Ngày Sách và Văn hóa đọc Việt Nam',
    isLunar: false,
    day: 21,
    month: 4,
    isMajor: false,
    category: 'cultural',
    description: 'Khuyến khích thói quen đọc sách và lan tỏa tri thức trong toàn xã hội.',
  },
  {
    title: 'Ngày Giải phóng Miền Nam',
    isLunar: false,
    day: 30,
    month: 4,
    isMajor: true,
    category: 'national',
    description: 'Đại thắng mùa xuân 1975, giang sơn thu về một mối, thống nhất non sông Việt Nam.',
  },

  // Tháng 5
  {
    title: 'Ngày Quốc tế Lao động',
    isLunar: false,
    day: 1,
    month: 5,
    isMajor: true,
    category: 'national',
    description: 'Ngày hội biểu dương lực lượng của giai cấp công nhân và người lao động toàn cầu.',
  },
  {
    title: 'Ngày Chiến thắng Điện Biên Phủ',
    isLunar: false,
    day: 7,
    month: 5,
    isMajor: true,
    category: 'national',
    description: 'Chiến thắng lịch sử Điện Biên Phủ năm 1954 "Lừng lẫy năm châu, chấn động địa cầu".',
  },
  {
    title: 'Ngày Thành lập Đội TNTP Hồ Chí Minh',
    isLunar: false,
    day: 15,
    month: 5,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm thành lập Đội Thiếu niên Tiền phong Hồ Chí Minh (15/05/1941).',
  },
  {
    title: 'Ngày Sinh Chủ tịch Hồ Chí Minh',
    isLunar: false,
    day: 19,
    month: 5,
    isMajor: true,
    category: 'national',
    description: 'Kỷ niệm ngày sinh của Chủ tịch Hồ Chí Minh (19/05/1890) - Anh hùng giải phóng dân tộc.',
  },

  // Tháng 6
  {
    title: 'Ngày Quốc tế Thiếu nhi',
    isLunar: false,
    day: 1,
    month: 6,
    isMajor: true,
    category: 'international',
    description: 'Ngày hội chăm sóc, yêu thương và bảo vệ quyền lợi chính đáng cho trẻ em.',
  },
  {
    title: 'Ngày Bác Hồ ra đi tìm đường cứu nước',
    isLunar: false,
    day: 5,
    month: 6,
    isMajor: false,
    category: 'national',
    description: 'Người thanh niên Nguyễn Tất Thành rời bến cảng Nhà Rồng ra đi cứu nước (05/06/1911).',
  },
  {
    title: 'Ngày Báo chí Cách mạng Việt Nam',
    isLunar: false,
    day: 21,
    month: 6,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Bác Hồ sáng lập báo Thanh Niên (1925), tôn vinh người làm báo cách mạng.',
  },
  {
    title: 'Ngày Gia đình Việt Nam',
    isLunar: false,
    day: 28,
    month: 6,
    isMajor: false,
    category: 'cultural',
    description: 'Tôn vinh giá trị ấm áp thiêng liêng của mái ấm gia đình - tế bào của xã hội.',
  },

  // Tháng 7
  {
    title: 'Ngày Truyền thống Thanh niên Xung phong',
    isLunar: false,
    day: 15,
    month: 7,
    isMajor: false,
    category: 'national',
    description: 'Ghi nhận những đóng góp anh dũng của lực lượng Thanh niên xung phong Việt Nam (1950).',
  },
  {
    title: 'Ngày Thương binh Liệt sĩ',
    isLunar: false,
    day: 27,
    month: 7,
    isMajor: true,
    category: 'national',
    description: 'Đạo lý "Uống nước nhớ nguồn", đời đời tri ân các anh hùng liệt sĩ hy sinh vì Tổ quốc.',
  },
  {
    title: 'Ngày Thành lập Công đoàn Việt Nam',
    isLunar: false,
    day: 28,
    month: 7,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm thành lập Tổng Liên đoàn Lao động Việt Nam (28/07/1929).',
  },

  // Tháng 8
  {
    title: 'Ngày Cách mạng Tháng Tám',
    isLunar: false,
    day: 19,
    month: 8,
    isMajor: true,
    category: 'national',
    description: 'Cách mạng Tháng Tám năm 1945 thành công & Ngày truyền thống Công an Nhân dân Việt Nam.',
  },

  // Tháng 9
  {
    title: 'Ngày Quốc Khánh Việt Nam',
    isLunar: false,
    day: 2,
    month: 9,
    isMajor: true,
    category: 'national',
    description: 'Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước VNDCCH (02/09/1945).',
  },
  {
    title: 'Ngày Thành lập Đài Truyền hình Việt Nam',
    isLunar: false,
    day: 7,
    month: 9,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm buổi phát sóng truyền hình đầu tiên của VTV (07/09/1970).',
  },
  {
    title: 'Ngày Thành lập Mặt trận Tổ quốc Việt Nam',
    isLunar: false,
    day: 10,
    month: 9,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm thành lập Mặt trận Tổ quốc Việt Nam củng cố khối đại đoàn kết toàn dân (1955).',
  },

  // Tháng 10
  {
    title: 'Ngày Quốc tế Người cao tuổi',
    isLunar: false,
    day: 1,
    month: 10,
    isMajor: false,
    category: 'international',
    description: 'Đạo lý kính lão đắc thọ, chăm sóc phụng dưỡng và tôn kính thế hệ ông bà cha mẹ.',
  },
  {
    title: 'Ngày Giải phóng Thủ đô Hà Nội',
    isLunar: false,
    day: 10,
    month: 10,
    isMajor: true,
    category: 'national',
    description: 'Quân ta tiến về tiếp quản Thủ đô Hà Nội rực rỡ cờ hoa ngày 10/10/1954.',
  },
  {
    title: 'Ngày Doanh nhân Việt Nam',
    isLunar: false,
    day: 13,
    month: 10,
    isMajor: false,
    category: 'cultural',
    description: 'Tôn vinh đội ngũ doanh nhân đóng góp xây dựng nền kinh tế đất nước vững mạnh.',
  },
  {
    title: 'Ngày Hội Nông dân Việt Nam',
    isLunar: false,
    day: 14,
    month: 10,
    isMajor: false,
    category: 'national',
    description: 'Tôn vinh giai cấp nông dân cần cù một nắng hai sương làm ra hạt ngọc nuôi đời.',
  },
  {
    title: 'Ngày Truyền thống Hội LHTN Việt Nam',
    isLunar: false,
    day: 15,
    month: 10,
    isMajor: false,
    category: 'national',
    description: 'Ngày hội của thanh niên Việt Nam đoàn kết cống hiến vì đất nước (1956).',
  },
  {
    title: 'Ngày Phụ nữ Việt Nam',
    isLunar: false,
    day: 20,
    month: 10,
    isMajor: true,
    category: 'cultural',
    description: 'Kỷ niệm thành lập Hội Phụ nữ (1930), tôn vinh người phụ nữ Việt Nam kiên cường, đảm đang.',
  },
  {
    title: 'Lễ hội Halloween',
    isLunar: false,
    day: 31,
    month: 10,
    isMajor: false,
    category: 'international',
    description: 'Đêm hội hóa trang vui nhộn mang lại nhiều niềm vui cho giới trẻ.',
  },

  // Tháng 11
  {
    title: 'Ngày Pháp luật Việt Nam',
    isLunar: false,
    day: 9,
    month: 11,
    isMajor: false,
    category: 'national',
    description: 'Tôn vinh Hiến pháp và pháp luật, xây dựng xã hội thượng tôn pháp luật.',
  },
  {
    title: 'Ngày Hội Đại đoàn kết Toàn dân tộc',
    isLunar: false,
    day: 18,
    month: 11,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm thành lập Mặt trận Dân tộc Thống nhất Việt Nam (18/11/1930).',
  },
  {
    title: 'Ngày Nhà giáo Việt Nam',
    isLunar: false,
    day: 20,
    month: 11,
    isMajor: true,
    category: 'cultural',
    description: 'Đạo lý "Tôn sư trọng đạo", tri ân công lao dạy dỗ của quý thầy cô giáo.',
  },
  {
    title: 'Ngày Thành lập Hội Chữ thập đỏ Việt Nam',
    isLunar: false,
    day: 23,
    month: 11,
    isMajor: false,
    category: 'cultural',
    description: 'Kỷ niệm ngày Bác Hồ sáng lập Hội Chữ thập đỏ Việt Nam giàu lòng nhân ái (1946).',
  },

  // Tháng 12
  {
    title: 'Ngày Thế giới phòng chống AIDS',
    isLunar: false,
    day: 1,
    month: 12,
    isMajor: false,
    category: 'international',
    description: 'Chung tay nâng cao nhận thức và bảo vệ sức khỏe cộng đồng toàn xã hội.',
  },
  {
    title: 'Ngày Thành lập Hội Cựu chiến binh Việt Nam',
    isLunar: false,
    day: 6,
    month: 12,
    isMajor: false,
    category: 'national',
    description: 'Tôn vinh phẩm chất "Bộ đội Cụ Hồ" của các thế hệ cựu chiến binh (1989).',
  },
  {
    title: 'Ngày Toàn quốc Kháng chiến',
    isLunar: false,
    day: 19,
    month: 12,
    isMajor: false,
    category: 'national',
    description: 'Kỷ niệm Lời kêu gọi Toàn quốc kháng chiến của Chủ tịch Hồ Chí Minh (19/12/1946).',
  },
  {
    title: 'Ngày Thành lập Quân đội Nhân dân Việt Nam',
    isLunar: false,
    day: 22,
    month: 12,
    isMajor: true,
    category: 'national',
    description: 'Kỷ niệm thành lập QĐND Việt Nam (22/12/1944) & Ngày Hội Quốc phòng Toàn dân.',
  },
  {
    title: 'Đêm Giáng Sinh (Christmas Eve)',
    isLunar: false,
    day: 24,
    month: 12,
    isMajor: false,
    category: 'international',
    description: 'Đêm mừng Giáng sinh an lành, ấm áp bên người thân và bạn bè.',
  },
  {
    title: 'Lễ Giáng Sinh (Noel)',
    isLunar: false,
    day: 25,
    month: 12,
    isMajor: true,
    category: 'international',
    description: 'Đại lễ kỷ niệm ngày Chúa Giê-su giáng sinh, cầu chúc an bình cho nhân loại.',
  },
];

/**
 * Lấy tiêu đề ngày lễ (nếu có) cho một ngày Âm / Dương cụ thể
 */
export function getHoliday(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number
): string | undefined {
  // 1. Ưu tiên kiểm tra ngày lễ Âm lịch trước
  const lunarH = HOLIDAYS.find(
    (h) => h.isLunar && h.day === lunarDay && h.month === lunarMonth
  );
  if (lunarH) return lunarH.title;

  // 2. Tiếp theo kiểm tra ngày lễ Dương lịch
  const solarH = HOLIDAYS.find(
    (h) => !h.isLunar && h.day === solarDay && h.month === solarMonth
  );
  if (solarH) return solarH.title;

  // 3. Đánh dấu ngày Rằm hoặc Mùng 1 nếu không trùng lễ cụ thể khác
  if (lunarDay === 1) return 'Ngày Mùng Một (Sóc)';
  if (lunarDay === 15) return 'Ngày Rằm (Vọng)';

  return undefined;
}

/**
 * Lấy đầy đủ thông tin chi tiết của ngày lễ
 */
export function getHolidayDetails(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number
): Holiday | undefined {
  const lunarH = HOLIDAYS.find(
    (h) => h.isLunar && h.day === lunarDay && h.month === lunarMonth
  );
  if (lunarH) return lunarH;

  const solarH = HOLIDAYS.find(
    (h) => !h.isLunar && h.day === solarDay && h.month === solarMonth
  );
  if (solarH) return solarH;

  return undefined;
}

/**
 * Kiểm tra xem ngày đó có phải là Ngày Lễ Lớn hay không
 */
export function isMajorHoliday(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number
): boolean {
  const h = getHolidayDetails(solarDay, solarMonth, lunarDay, lunarMonth);
  return !!h?.isMajor;
}

/**
 * Lấy tất cả các ngày lễ cho một ngày cụ thể (nếu có cả lễ Âm và Dương trùng ngày)
 */
export function getAllHolidaysForDay(
  solarDay: number,
  solarMonth: number,
  lunarDay: number,
  lunarMonth: number
): Holiday[] {
  return HOLIDAYS.filter(
    (h) =>
      (h.isLunar && h.day === lunarDay && h.month === lunarMonth) ||
      (!h.isLunar && h.day === solarDay && h.month === solarMonth)
  );
}
