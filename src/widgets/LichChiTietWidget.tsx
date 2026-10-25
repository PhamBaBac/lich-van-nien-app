'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { FullDayData } from '../core/types/lunar.types';

interface LichChiTietWidgetProps {
  data: FullDayData;
  isDark?: boolean;
}

export function LichChiTietWidget({ data, isDark = false }: LichChiTietWidgetProps) {
  const isZodiac = data.fengShui.isZodiacDay;
  const goodHours = data.zodiacHours
    ? data.zodiacHours.filter((h) => h.isZodiac).map((h) => h.branch).join(', ')
    : '';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'row',
        backgroundColor: isDark ? '#18191E' : '#FFFFFF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: isDark ? '#2D3039' : '#E8E2D5',
        overflow: 'hidden',
      }}
    >
      {/* Cột trái: Khối Lịch Dương sang trọng */}
      <FlexWidget
        style={{
          flex: 38,
          height: 'match_parent',
          backgroundColor: isDark ? '#7A1318' : '#8E161C',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 6,
        }}
      >
        <TextWidget
          text={data.solar.dayOfWeek.toUpperCase()}
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            color: '#FEF9E7',
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        />

        <TextWidget
          text={`${data.solar.day}`}
          style={{
            fontSize: 44,
            fontWeight: 'bold',
            color: '#FFFFFF',
            lineHeight: 46,
            textAlign: 'center',
          }}
        />

        <TextWidget
          text={`Tháng ${data.solar.month}, ${data.solar.year}`}
          style={{
            fontSize: 10,
            color: '#FCDADA',
            textAlign: 'center',
          }}
        />
      </FlexWidget>

      {/* Cột phải: Khối Lịch Âm & Cát Hung Phong Thuỷ */}
      <FlexWidget
        style={{
          flex: 62,
          height: 'match_parent',
          backgroundColor: isDark ? '#18191E' : '#FFFFFF',
          justifyContent: 'space-between',
          paddingVertical: 9,
          paddingHorizontal: 12,
        }}
      >
        {/* Hàng 1: Ngày Âm lịch to rõ */}
        <FlexWidget style={{ width: 'match_parent' }}>
          <TextWidget
            text={`NGÀY ${data.lunar.day} THÁNG ${data.lunar.month}${data.lunar.isLeapMonth ? ' (NHUẬN)' : ''}`}
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              color: isDark ? '#E8CA66' : '#8E161C',
            }}
          />
          <TextWidget
            text={`Năm ${data.canChi.yearCanChi}`}
            style={{
              fontSize: 11,
              color: isDark ? '#9EA3B0' : '#6B7280',
              marginTop: 1,
            }}
          />
        </FlexWidget>

        {/* Hàng 2: Can Chi Ngày & Nạp Âm */}
        <TextWidget
          text={`Ngày ${data.canChi.dayCanChi} (${data.canChi.element})`}
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: isDark ? '#FAF7F2' : '#1E2229',
          }}
        />

        {/* Hàng 3: Badge Hoàng/Hắc Đạo & Tiết Khí */}
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
            text={` • ${data.fengShui.solarTerm || ''}`}
            style={{
              fontSize: 10,
              color: isDark ? '#9EA3B0' : '#6B7280',
            }}
          />
        </FlexWidget>

        {/* Hàng 4: Giờ tốt hoàng đạo */}
        <TextWidget
          text={`Giờ tốt: ${goodHours}`}
          truncate="END"
          maxLines={1}
          style={{
            fontSize: 9,
            color: isDark ? '#7E8696' : '#64748B',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
