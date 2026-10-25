'use no memo';
import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';
import { FullDayData } from '../core/types/lunar.types';

interface LichNgayWidgetProps {
  data: FullDayData;
  isDark?: boolean;
}

export function LichNgayWidget({ data, isDark = false }: LichNgayWidgetProps) {
  const isZodiac = data.fengShui.isZodiacDay;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        width: 'match_parent',
        height: 'match_parent',
        backgroundColor: isDark ? '#18191E' : '#FFFFFF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: isDark ? '#2D3039' : '#E8E2D5',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Thanh tiêu đề Thứ & Tháng Dương */}
      <FlexWidget
        style={{
          width: 'match_parent',
          backgroundColor: isDark ? '#871C22' : '#8E161C',
          paddingVertical: 7,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <TextWidget
          text={`${data.solar.dayOfWeek.toUpperCase()} • THÁNG ${data.solar.month}`}
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            color: '#FEF9E7',
            letterSpacing: 0.5,
            textAlign: 'center',
          }}
        />
      </FlexWidget>

      {/* Số ngày Dương to nổi bật */}
      <FlexWidget
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
        }}
      >
        <TextWidget
          text={`${data.solar.day}`}
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: isDark ? '#FAF7F2' : '#8E161C',
            lineHeight: 50,
            textAlign: 'center',
          }}
        />
        <TextWidget
          text={`Năm ${data.solar.year}`}
          style={{
            fontSize: 11,
            color: isDark ? '#9EA3B0' : '#71717A',
            marginTop: 2,
            textAlign: 'center',
          }}
        />
      </FlexWidget>

      {/* Khối Âm Lịch & Can Chi */}
      <FlexWidget
        style={{
          width: 'match_parent',
          paddingHorizontal: 8,
          paddingBottom: 8,
          alignItems: 'center',
        }}
      >
        <FlexWidget
          style={{
            width: 'match_parent',
            backgroundColor: isDark ? '#232630' : '#FAF5EE',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDark ? '#323642' : '#F0E6D8',
            paddingVertical: 5,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TextWidget
            text={`Âm: ${data.lunar.day}/${data.lunar.month}${data.lunar.isLeapMonth ? ' Nhuận' : ''} • ${data.canChi.dayCanChi}`}
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              color: isDark ? '#E8CA66' : '#8E161C',
              textAlign: 'center',
            }}
          />
          <TextWidget
            text={`★ ${isZodiac ? 'Ngày Hoàng Đạo' : 'Ngày Hắc Đạo'}`}
            style={{
              fontSize: 10,
              fontWeight: 'bold',
              color: isZodiac ? '#D4AF37' : isDark ? '#A1A1AA' : '#718096',
              marginTop: 2,
              textAlign: 'center',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
}
