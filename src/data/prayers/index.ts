export interface Prayer {
  id: string;
  title: string;
  category: string;
  occasion: string;
  offerings: string[];
  content: string[];
}

export const SAMPLE_PRAYERS: Prayer[] = [
  {
    id: 'ram_mung_1',
    title: 'Văn khấn Thần Linh và Gia Tiên ngày Rằm và Mùng 1',
    category: 'Định kỳ',
    occasion: 'Dùng cho ngày mùng 1 (Sóc) và ngày rằm (Vọng) hàng tháng tại gia',
    offerings: [
      'Hương hoa tươi (hoa cúc, hoa huệ)',
      'Trầu cau, quả tươi ngũ quả',
      'Đèn dầu hoặc nến',
      'Nước trà sạch hoặc chén rượu trắng',
      'Tiền vàng mã, mâm cỗ chay hoặc cỗ mặn',
    ],
    content: [
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
      'Con lạy chín phương Trời, mười phương Chư Phật, Chư Phật mười phương.',
      'Con kính lạy Hoàng thiên Hậu Thổ chư vị Tôn thần.',
      'Con kính lạy ngài Đông Trù Tư mệnh Táo phủ Thần quân.',
      'Con kính lạy Thần linh, Thổ địa cai quản trong xứ này.',
      'Con kính lạy Cao Tằng Tổ Khảo, Cao Tằng Tổ Tỷ, bá thúc huynh đệ, cô di tỷ muội nội ngoại gia tộc.',
      'Hôm nay là ngày... tháng... năm... âm lịch.',
      'Tín chủ (chúng) con là: ... Ngụ tại: ...',
      'Thành tâm sửa biện hương hoa lễ vật, kim ngân trà quả, thắp nén tâm hương dâng lên trước án.',
      'Chúng con kính mời ngài Kim Niên Đương cai Thái Tuế chí đức Tôn thần, ngài Bản cảnh Thành hoàng Chư vị Đại Vương, ngài Bản xứ Thần linh Thổ địa, ngài Định phúc Táo quân, các ngài Địa chúa Long mạch Tôn thần và tất cả các Vị Thần linh cai quản trong xứ này giáng lâm trước án, chứng giám lòng thành, thụ hưởng lễ vật.',
      'Chúng con kính mời các cụ Tổ Khảo, Tổ Tỷ, chư vị Hương linh gia tiên nội ngoại, cúi xin thương xót con cháu, giáng phó linh sàng, chứng giám tâm thành, thụ hưởng lễ vật.',
      'Cúi xin chư vị phù hộ độ trì cho toàn gia chúng con an ninh khang thái, vạn sự tốt lành, gia đạo hưng long, sở cầu như ý, sở nguyện tòng tâm.',
      'Dãi tấm lòng thành, cúi xin chứng giám.',
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
    ],
  },
  {
    id: 'giao_thua',
    title: 'Văn khấn Giao Thừa ngoài trời (Năm Mới)',
    category: 'Lễ Tết',
    occasion: 'Dùng vào thời khắc chuyển giao giữa năm cũ và năm mới ngoài sân',
    offerings: [
      'Gà trống thiến luộc ngậm hoa hồng (hoặc mâm cỗ chay)',
      'Bánh chưng, xôi gấc đỏ',
      'Mâm ngũ quả, hoa tươi',
      'Trầu cau, rượu, trà, nước',
      'Vàng mã đón Thái Tuế đương niên',
    ],
    content: [
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
      'Con kính lạy Quan Đương niên Hành khiển, Quan Tề vương Hành khiển, Hư Tào phán quan.',
      'Con kính lạy các ngài Ngũ phương, Ngũ thổ, Long mạch, Tài thần, Bản xứ định phúc Táo quân.',
      'Giờ phút Giao thừa thiêng liêng vừa tới, năm cũ qua đi, năm mới đón mừng.',
      'Cúi xin các ngài giáng lâm thụ hưởng, phù hộ cho đất nước thanh bình, gia đình an khang thịnh vượng.',
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
    ],
  },
  {
    id: 'than_tai',
    title: 'Văn khấn Thần Tài - Thổ Địa cầu tài lộc buôn bán',
    category: 'Tài Lộc',
    occasion: 'Dùng hàng ngày hoặc ngày mùng 10 tháng Giêng (Vía Thần Tài)',
    offerings: [
      'Bình hoa đồng tiền hoặc hoa cúc vàng',
      'Thịt heo quay hoặc trứng luộc, tôm',
      'Chén nước sạch, rượu và trà',
      'Đĩa tỏi, thuốc lá',
    ],
    content: [
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
      'Con kính lạy ngài Hoàng Thiên Hậu Thổ chư vị Tôn thần.',
      'Con kính lạy ngài Tài Thần vị tiền chứng giám.',
      'Cúi xin Thần Tài ban tài tiếp lộc, phù hộ công việc hanh thông, buôn may bán đắt.',
      'Nam mô A Di Đà Phật! (3 lần, 3 lạy)',
    ],
  },
];
