'use no memo';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { getFullDayData } from '../core';
import { LichBarWidget } from './LichBarWidget';
import { LichNgayWidget } from './LichNgayWidget';
import { LichChiTietWidget } from './LichChiTietWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, widgetInfo, renderWidget } = props;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const todayData = getFullDayData(new Date());

      if (widgetInfo.widgetName === 'LichBar') {
        renderWidget({
          light: <LichBarWidget data={todayData} isDark={false} />,
          dark: <LichBarWidget data={todayData} isDark={true} />,
        });
      } else if (widgetInfo.widgetName === 'LichNgay') {
        renderWidget({
          light: <LichNgayWidget data={todayData} isDark={false} />,
          dark: <LichNgayWidget data={todayData} isDark={true} />,
        });
      } else if (widgetInfo.widgetName === 'LichChiTiet') {
        renderWidget({
          light: <LichChiTietWidget data={todayData} isDark={false} />,
          dark: <LichChiTietWidget data={todayData} isDark={true} />,
        });
      }
      break;
    }

    case 'WIDGET_CLICK':
      // OPEN_APP được xử lý tự động ở native layer
      break;

    case 'WIDGET_DELETED':
      break;

    default:
      break;
  }
}
