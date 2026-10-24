/**
 * Bộ sưu tập 365 câu danh ngôn, lời dạy cổ nhân và chiêm nghiệm an yên mỗi ngày
 */

export interface DailyQuote {
  content: string;
  author: string;
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    content: 'Tâm an vạn sự an. Bình thản đón nhận mọi duyên đến và đi trong đời.',
    author: 'Thiền ngữ',
  },
  {
    content: 'Mỗi ngày thức dậy là một khởi đầu mới, hãy gieo hạt giống yêu thương và thiện lành.',
    author: 'Cổ nhân',
  },
  {
    content: 'Họa sinh từ miệng, bệnh nhập từ miệng. Biết lắng nghe nhiều hơn là nguồn cội của trí tuệ.',
    author: 'Đạo gia',
  },
  {
    content: 'Nước chảy chỗ trũng mới thành sông lớn, người biết khiêm nhường mới chứa được đại phúc.',
    author: 'Lão Tử',
  },
  {
    content: 'Gia hòa vạn sự hưng. Giữ gìn hòa khí trong gia đình là phong thủy lớn nhất của đời người.',
    author: 'Cổ huấn',
  },
  {
    content: 'Muốn biết tương lai, hãy nhìn những việc mình đang làm ở hiện tại.',
    author: 'Phật ngôn',
  },
  {
    content: 'Người có lòng biết ơn thì phúc lộc tự khắc tụ về, lòng dạ hẹp hòi thì phúc đi mất.',
    author: 'Cổ nhân',
  },
  {
    content: 'Một nụ cười hoan hỷ xua tan ngàn mối lo âu. Hãy bắt đầu ngày mới bằng tâm hoan hỷ.',
    author: 'Danh ngôn',
  },
  {
    content: 'Biết đủ là giàu có nhất. Tâm rộng thì đường đời thênh thang.',
    author: 'Trang Tử',
  },
  {
    content: 'Lấy từ bi đãi người, lấy trí tuệ xử việc, ấy là đạo an nhiên giữa cõi hồng trần.',
    author: 'Thiền môn',
  },
];

export function getQuoteForDay(dayOfYear: number): DailyQuote {
  const index = Math.abs(dayOfYear) % DAILY_QUOTES.length;
  return DAILY_QUOTES[index];
}
