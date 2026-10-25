'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { FullDayData } from '../core/types/lunar.types';

interface LichBarWidgetProps {
  data: FullDayData;
  isDark?: boolean;
}

/**
 * Widget Thanh Ngang 4x1 (Siêu Gọn - Chỉ chiếm 1 hàng icon)
 */
export function LichBarWidget({ data, isDark = false }: LichBarWidgetProps) {
  const isZodiac = data.fengShui.isZodiacDay;
  const goodHours = data.zodiacHours
    ? data.zodiacHours
        .filter((h) => h.isZodiac)
        .slice(0, 4)
        .map((h) => h.branch)
        .join(', ')
    : '';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? '#18191E' : '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: isDark ? '#2D3039' : '#E8E2D5',
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      {/* 1. Khối Ngày Dương */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <FlexWidget
          style={{
            backgroundColor: isDark ? '#7A1318' : '#8E161C',
            borderRadius: 8,
            paddingHorizontal: 7,
            paddingVertical: 3,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={`${data.solar.day}`}
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#FFFFFF',
            }}
          />
        </FlexWidget>

        <FlexWidget style={{ marginLeft: 6 }}>
          <TextWidget
            text={`${data.solar.dayOfWeekShort}, Th.${data.solar.month}`}
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              color: isDark ? '#FAF7F2' : '#1E2229',
            }}
          />
          <TextWidget
            text={`Năm ${data.solar.year}`}
            style={{
              fontSize: 9,
              color: isDark ? '#9EA3B0' : '#71717A',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* 2. Khối Âm Lịch & Can Chi */}
      <FlexWidget
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
      >
        <TextWidget
          text={`ÂL: ${data.lunar.day}/${data.lunar.month}${data.lunar.isLeapMonth ? ' Nhuận' : ''}`}
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: isDark ? '#E8CA66' : '#8E161C',
          }}
        />
        <TextWidget
          text={`${data.canChi.dayCanChi} (${data.canChi.yearCanChi})`}
          style={{
            fontSize: 9,
            color: isDark ? '#CBD5E1' : '#64748B',
            marginTop: 1,
          }}
        />
      </FlexWidget>

      {/* 3. Khối Hoàng Đạo & Giờ Tốt */}
      <FlexWidget
        style={{
          alignItems: 'flex-end',
          justifyContent: 'center',
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
            borderRadius: 6,
            paddingHorizontal: 6,
            paddingVertical: 2,
          }}
        >
          <TextWidget
            text={isZodiac ? '★ Hoàng Đạo' : 'Hắc Đạo'}
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: isZodiac ? '#B38F24' : '#718096',
            }}
          />
        </FlexWidget>

        <TextWidget
          text={`Giờ: ${goodHours}`}
          style={{
            fontSize: 8,
            color: isDark ? '#94A3B8' : '#64748B',
            marginTop: 2,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
