'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { FullDayData } from '../core/types/lunar.types';

interface LichChiTietWidgetProps {
  data: FullDayData;
  isDark?: boolean;
}

/**
 * Widget Vạn Niên Chi Tiết 4x2 - Tờ Lịch Bloc thu nhỏ với đầy đủ thông số phong thủy
 */
export function LichChiTietWidget({ data, isDark = false }: LichChiTietWidgetProps) {
  const isZodiac = data.fengShui.isZodiacDay;
  const goodHours = data.zodiacHours
    ? data.zodiacHours
        .filter((h) => h.isZodiac)
        .map((h) => h.branch)
        .join(', ')
    : '';

  const suitableStr = data.fengShui.suitable && data.fengShui.suitable.length > 0
    ? data.fengShui.suitable.slice(0, 4).join(', ')
    : 'Cúng tế, xuất hành, cầu tài';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'row',
        backgroundColor: isDark ? '#18191E' : '#FFFFFF',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: isDark ? '#2D3039' : '#E8E2D5',
        overflow: 'hidden',
      }}
    >
      {/* 1. Cột trái: Khối Lịch Dương & Tờ Bloc đỏ Chu Sa */}
      <FlexWidget
        style={{
          flex: 32,
          height: 'match_parent',
          backgroundColor: isDark ? '#7A1318' : '#8E161C',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 4,
        }}
      >
        <TextWidget
          text={data.solar.dayOfWeek.toUpperCase()}
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: '#FEF9E7',
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        />

        <TextWidget
          text={`${data.solar.day}`}
          style={{
            fontSize: 40,
            fontWeight: 'bold',
            color: '#FFFFFF',
            lineHeight: 42,
            textAlign: 'center',
          }}
        />

        <TextWidget
          text={`Th.${data.solar.month} - ${data.solar.year}`}
          style={{
            fontSize: 9.5,
            color: '#FCDADA',
            textAlign: 'center',
          }}
        />

        <FlexWidget
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 6,
            paddingVertical: 2,
            paddingHorizontal: 6,
            alignItems: 'center',
          }}
        >
          <TextWidget
            text={`ÂL: ${data.lunar.day}/${data.lunar.month}`}
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: '#FEF9E7',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* 2. Cột phải: Khối Thông Tin Phong Thủy & Lịch Âm Toàn Diện */}
      <FlexWidget
        style={{
          flex: 68,
          height: 'match_parent',
          backgroundColor: isDark ? '#18191E' : '#FFFFFF',
          justifyContent: 'space-between',
          paddingVertical: 7,
          paddingHorizontal: 10,
        }}
      >
        {/* Dòng 1: Tiêu Đề Ngày Âm & Năm Can Chi */}
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 'match_parent',
          }}
        >
          <TextWidget
            text={`NGÀY ${data.lunar.day} THÁNG ${data.lunar.month}${data.lunar.isLeapMonth ? ' (NHUẬN)' : ''}`}
            style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: isDark ? '#E8CA66' : '#8E161C',
            }}
          />
          <TextWidget
            text={`Năm ${data.canChi.yearCanChi}`}
            style={{
              fontSize: 10,
              color: isDark ? '#9EA3B0' : '#6B7280',
            }}
          />
        </FlexWidget>

        {/* Dòng 2: Can Chi Ngày, Ngũ Hành & Thập Nhị Trực */}
        <TextWidget
          text={`Ngày ${data.canChi.dayCanChi} (${data.canChi.element}) • Trực ${data.fengShui.duty}`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            color: isDark ? '#FAF7F2' : '#1E2229',
          }}
        />

        {/* Dòng 3: Hoàng/Hắc Đạo & Tiết Khí */}
        <FlexWidget
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <FlexWidget
            style={{
              backgroundColor: isZodiac
                ? isDark
                  ? '#2D2817'
                  : '#FEF9E7'
                : isDark
                ? '#262830'
                : '#F4F4F5',
              borderRadius: 5,
              paddingHorizontal: 5,
              paddingVertical: 1.5,
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
          </FlexWidget>

          <TextWidget
            text={` • Tiết ${data.fengShui.solarTerm || ''}`}
            style={{
              fontSize: 9.5,
              color: isDark ? '#9EA3B0' : '#6B7280',
              marginLeft: 4,
            }}
          />
        </FlexWidget>

        {/* Dòng 4: Giờ Tốt Hoàng Đạo Trong Ngày */}
        <TextWidget
          text={`Giờ tốt: ${goodHours}`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 9,
            color: isDark ? '#CBD5E1' : '#334155',
          }}
        />

        {/* Dòng 5: Hướng Xuất Hành (Hỷ Thần & Tài Thần) */}
        <TextWidget
          text={`Hướng tốt: Hỷ Thần (${data.fengShui.directions.joyGod}) | Tài Thần (${data.fengShui.directions.wealthGod})`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 8.5,
            color: isDark ? '#94A3B8' : '#475569',
          }}
        />

        {/* Dòng 6: Lời khuyên việc nên làm */}
        <TextWidget
          text={`Nên làm: ${suitableStr}`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 8.5,
            color: isDark ? '#34D399' : '#15803D',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
