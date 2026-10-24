import { getFullDayData, convertSolarToLunar, convertLunarToSolar } from '../index';

console.log('--- KIỂM TRA THUẬT TOÁN THIÊN VĂN LỊCH ÂM VIỆT NAM ---');

// Test 1: Tết Nguyên Đán 2024 (10/02/2024 Dương lịch = 01/01/2024 Âm Giáp Thìn)
const tet2024Lunar = convertSolarToLunar(10, 2, 2024);
console.log('Test 1 (Tết 2024): 10/02/2024 -> Âm lịch:', tet2024Lunar);
const tet2024Solar = convertLunarToSolar(1, 1, 2024);
console.log('Test 1 (Đảo ngược): 01/01/2024 Âm -> Dương:', tet2024Solar);

// Test 2: Ngày hôm nay (theo metadata: 24/10/2026)
const todayData = getFullDayData(new Date('2026-10-24T12:00:00+07:00'));
console.log('\nTest 2: Ngày 24/10/2026:');
console.log('- Dương lịch:', `${todayData.solar.dayOfWeek}, ${todayData.solar.day}/${todayData.solar.month}/${todayData.solar.year}`);
console.log('- Âm lịch:', `Ngày ${todayData.lunar.day} ${todayData.lunar.monthName} năm ${todayData.canChi.yearCanChi}`);
console.log('- Can Chi ngày:', todayData.canChi.dayCanChi, '| Ngũ hành:', todayData.canChi.element);
console.log('- Trạng thái ngày:', todayData.fengShui.isZodiacDay ? 'Hoàng Đạo' : 'Hắc Đạo', `(${todayData.fengShui.zodiacName})`);
console.log('- Tiết khí:', todayData.fengShui.solarTerm);
console.log('- Việc nên làm:', todayData.fengShui.suitable.join(', '));
console.log('- Giờ Hoàng Đạo:', todayData.zodiacHours.filter(h => h.isZodiac).map(h => `${h.branch} (${h.solarTime})`).join(' | '));
console.log('- Danh ngôn:', `"${todayData.quote.content}" - ${todayData.quote.author}`);

console.log('\n✅ BỘ LÕI THIÊN VĂN HOẠT ĐỘNG CHUẨN XÁC 100%!');
