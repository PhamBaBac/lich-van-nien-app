'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { FullDayData } from '../core/types/lunar.types';

interface LichNgayWidgetProps {
  data: FullDayData;
  isDark?: boolean;
}

/**
 * Widget Vuông 2x2 - Thiết kế đậm chất Lịch Vạn Niên, tối ưu diện tích, giàu thông tin
 */
export function LichNgayWidget({ data, isDark = false }: LichNgayWidgetProps) {
  const isZodiac = data.fengShui.isZodiacDay;
  const goodHours = data.zodiacHours
    ? data.zodiacHours
        .filter((h) => h.isZodiac)
        .slice(0, 5)
        .map((h) => h.branch)
        .join(', ')
    : '';

  const suitableStr = data.fengShui.suitable && data.fengShui.suitable.length > 0
    ? data.fengShui.suitable.slice(0, 3).join(', ')
    : 'Cúng tế, xuất hành';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: isDark ? '#18191E' : '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: isDark ? '#2D3039' : '#E8E2D5',
        justifyContent: 'space-between',
        padding: 8,
      }}
    >
      {/* 1. Header: Thứ và Ngày Dương Lịch */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: isDark ? '#7A1318' : '#8E161C',
          borderRadius: 8,
          paddingVertical: 4,
          paddingHorizontal: 6,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextWidget
          text={`${data.solar.dayOfWeek.toUpperCase()} • ${data.solar.day}/${data.solar.month}/${data.solar.year}`}
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: '#FEF9E7',
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        />
      </FlexWidget>

      {/* 2. Cặp Ngày Dương lớn & Ngày Âm Lịch nổi bật */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
          paddingHorizontal: 4,
          paddingVertical: 2,
        }}
      >
        {/* Số Dương */}
        <TextWidget
          text={`${data.solar.day}`}
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: isDark ? '#FAF7F2' : '#8E161C',
            lineHeight: 38,
          }}
        />

        {/* Khối Âm Lịch */}
        <FlexWidget style={{ alignItems: 'flex-end' }}>
          <TextWidget
            text={`ÂL: ${data.lunar.day}/${data.lunar.month}${data.lunar.isLeapMonth ? ' N' : ''}`}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: isDark ? '#E8CA66' : '#8E161C',
            }}
          />
          <TextWidget
            text={`Năm ${data.canChi.yearCanChi}`}
            style={{
              fontSize: 10,
              color: isDark ? '#CBD5E1' : '#64748B',
              marginTop: 1,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* 3. Can Chi Ngày & Ngũ Hành Nạp Âm */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: isDark ? '#22252E' : '#FAF6F0',
          borderRadius: 6,
          paddingHorizontal: 6,
          paddingVertical: 3,
        }}
      >
        <TextWidget
          text={`Ngày ${data.canChi.dayCanChi} (${data.canChi.element})`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 9.5,
            fontWeight: 'bold',
            color: isDark ? '#FAF7F2' : '#1E2229',
          }}
        />
      </FlexWidget>

      {/* 4. Trạng Thái Hoàng Đạo & Tiết Khí */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={`★ ${isZodiac ? 'Hoàng Đạo' : 'Hắc Đạo'} (${data.fengShui.zodiacName || ''})`}
          style={{
            fontSize: 9.5,
            fontWeight: 'bold',
            color: isZodiac ? '#B38F24' : '#718096',
          }}
        />
        <TextWidget
          text={`Tiết ${data.fengShui.solarTerm || ''}`}
          style={{
            fontSize: 9,
            color: isDark ? '#9EA3B0' : '#6B7280',
          }}
        />
      </FlexWidget>

      {/* 5. Giờ Tốt Hoàng Đạo */}
      <TextWidget
        text={`Giờ tốt: ${goodHours}`}
        truncate="END"
        maxLines={1}
        style={{
          fontSize: 8.5,
          color: isDark ? '#94A3B8' : '#475569',
        }}
      />

      {/* 6. Việc nên làm */}
      <TextWidget
        text={`Nên: ${suitableStr}`}
        truncate="END"
        maxLines={1}
        style={{
          fontSize: 8.5,
          color: isDark ? '#34D399' : '#15803D',
        }}
      />
    </FlexWidget>
  );
}
