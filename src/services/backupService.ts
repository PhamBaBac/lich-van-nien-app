/**
 * Dịch vụ Sao lưu (Export) & Khôi phục (Import) Sổ Giỗ Gia Tiên
 * Hỗ trợ lưu trữ lên Google Drive, Zalo, Email, Tệp tin máy
 */

import { File } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { LunarAnniversary, AnniversaryDisplayInfo } from '../core/types/event.types';
import { getRawAnniversaries, saveRawAnniversaries } from './anniversaryService';
import { scheduleImportantDatesOnly } from './notificationService';

export interface BackupPayload {
  app: string;
  version: number;
  exportDate: string;
  timestamp: number;
  totalItems: number;
  anniversaries: LunarAnniversary[];
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  totalCount: number;
  message: string;
  updatedList?: AnniversaryDisplayInfo[];
}

/**
 * Đọc nội dung tệp tin bằng nhiều giải pháp dự phòng (Hỗ trợ tốt nhất cho content://, file:// trên Android)
 */
async function readFileContent(uri: string): Promise<string> {
  // Cách 1: fetch(uri) - Giải pháp đọc content:// và file:// ổn định nhất trên Android React Native
  try {
    const res = await fetch(uri);
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 0) {
        return text;
      }
    }
  } catch (e) {
    console.warn('fetch(uri) không khả dụng, thử File.text()...', e);
  }

  // Cách 2: Sử dụng File class của Expo SDK mới
  try {
    const file = new File(uri);
    const text = await file.text();
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch (e) {
    console.warn('File.text() không khả dụng, thử readAsStringAsync...', e);
  }

  // Cách 3: Sử dụng FileSystem.readAsStringAsync (legacy)
  try {
    const text = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    if (text && text.trim().length > 0) {
      return text;
    }
  } catch (e) {
    console.warn('FileSystem.readAsStringAsync không đọc được:', e);
  }

  throw new Error('Không thể đọc tệp tin được chọn. Vui lòng cấp quyền đọc tệp hoặc thử lại.');
}

/**
 * Xuất dữ liệu Sổ Giỗ ra file JSON và mở trình chia sẻ (Lưu vào Google Drive, Zalo, Email...)
 */
export async function exportBackupFile(): Promise<{ success: boolean; message: string }> {
  try {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (!isSharingAvailable) {
      return {
        success: false,
        message: 'Thiết bị không hỗ trợ tính năng chia sẻ tệp tin.',
      };
    }

    const anniversaries = await getRawAnniversaries();
    if (anniversaries.length === 0) {
      return {
        success: false,
        message: 'Sổ Giỗ của bạn đang trống, chưa có dữ liệu ngày giỗ nào để sao lưu.',
      };
    }

    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}`;
    const fileName = `AnLich_SoGio_Backup_${dateStr}.json`;
    const cacheDir = FileSystem.cacheDirectory?.endsWith('/')
      ? FileSystem.cacheDirectory
      : `${FileSystem.cacheDirectory || ''}/`;
    const fileUri = `${cacheDir}${fileName}`;

    const payload: BackupPayload = {
      app: 'An Lịch - Lịch Vạn Niên Đương Đại',
      version: 1,
      exportDate: now.toLocaleString('vi-VN'),
      timestamp: now.getTime(),
      totalItems: anniversaries.length,
      anniversaries,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Sao lưu Sổ Giỗ Gia Tiên (Chọn Lưu vào Drive, Zalo...)',
      UTI: 'public.json',
    });

    return {
      success: true,
      message: `Đã mở trình sao lưu (${anniversaries.length} ngày giỗ). Bạn có thể chọn Lưu vào Google Drive hoặc gửi qua Zalo!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Có lỗi xảy ra khi tạo tệp sao lưu.',
    };
  }
}

/**
 * Nhập dữ liệu Sổ Giỗ từ tệp tin JSON đã sao lưu (từ Google Drive, Tệp, Zalo...)
 */
export async function importBackupFile(
  mode: 'merge' | 'replace' = 'merge'
): Promise<ImportResult | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const fileContent = await readFileContent(asset.uri);

    // Xóa ký tự Byte Order Mark (BOM \uFEFF) nếu có từ các trình soạn thảo Windows
    const cleanContent = fileContent.replace(/^\uFEFF/, '').trim();
    let parsed: any;
    try {
      parsed = JSON.parse(cleanContent);
    } catch {
      return {
        success: false,
        importedCount: 0,
        totalCount: 0,
        message: 'Tệp tin không đúng định dạng JSON hợp lệ. Vui lòng chọn đúng tệp sao lưu An Lịch (.json).',
      };
    }

    // Nhận diện linh hoạt cấu trúc dữ liệu: mảng, bọc anniversaries, data, items, events hoặc đối tượng đơn lẻ
    let itemsToImport: any[] = [];
    if (Array.isArray(parsed)) {
      itemsToImport = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.anniversaries)) {
        itemsToImport = parsed.anniversaries;
      } else if (Array.isArray(parsed.data)) {
        itemsToImport = parsed.data;
      } else if (Array.isArray(parsed.items)) {
        itemsToImport = parsed.items;
      } else if (Array.isArray(parsed.events)) {
        itemsToImport = parsed.events;
      } else if (Array.isArray(parsed.list)) {
        itemsToImport = parsed.list;
      } else if (parsed.title || parsed.name) {
        itemsToImport = [parsed];
      }
    }

    if (itemsToImport.length === 0) {
      return {
        success: false,
        importedCount: 0,
        totalCount: 0,
        message: 'Tệp tin không chứa dữ liệu Sổ Giỗ của ứng dụng An Lịch.',
      };
    }

    // Lọc và chuẩn hóa dữ liệu ngày giỗ, tương thích linh hoạt cả string lẫn number
    const validItems: LunarAnniversary[] = [];
    for (const item of itemsToImport) {
      if (!item || typeof item !== 'object') continue;

      const title = String(item.title || item.name || '').trim();
      const personName = item.personName ? String(item.personName).trim() : undefined;

      const rawDay = item.lunarDay !== undefined ? item.lunarDay : item.day;
      const rawMonth = item.lunarMonth !== undefined ? item.lunarMonth : item.month;

      const lunarDay = typeof rawDay === 'number' ? rawDay : parseInt(String(rawDay), 10);
      const lunarMonth = typeof rawMonth === 'number' ? rawMonth : parseInt(String(rawMonth), 10);

      const rawRemind = item.remindDaysBefore !== undefined ? item.remindDaysBefore : item.remind;
      const remindDaysBefore = typeof rawRemind === 'number' ? rawRemind : parseInt(String(rawRemind || 1), 10);

      const notes = item.notes ? String(item.notes).trim() : undefined;

      if (
        title.length > 0 &&
        !isNaN(lunarDay) &&
        lunarDay >= 1 &&
        lunarDay <= 30 &&
        !isNaN(lunarMonth) &&
        lunarMonth >= 1 &&
        lunarMonth <= 12
      ) {
        validItems.push({
          id: item.id || `anniversary_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          title,
          personName,
          lunarDay,
          lunarMonth,
          remindDaysBefore: isNaN(remindDaysBefore) ? 1 : remindDaysBefore,
          notes,
          createdAt: typeof item.createdAt === 'number' ? item.createdAt : Date.now(),
        });
      }
    }

    if (validItems.length === 0) {
      return {
        success: false,
        importedCount: 0,
        totalCount: 0,
        message: 'Tệp tin không chứa ngày giỗ hợp lệ nào (Cần có tên ngày giỗ, ngày âm và tháng âm lịch).',
      };
    }

    let finalList: LunarAnniversary[] = [];
    if (mode === 'replace') {
      finalList = validItems;
    } else {
      // Chế độ gộp (merge): tránh trùng lặp ngày giỗ cùng tên và cùng ngày âm
      const currentList = await getRawAnniversaries();
      const existingKeys = new Set(
        currentList.map(
          (i) => `${i.title.toLowerCase().trim()}_${i.lunarDay}_${i.lunarMonth}`
        )
      );

      finalList = [...currentList];
      for (const item of validItems) {
        const key = `${item.title.toLowerCase().trim()}_${item.lunarDay}_${item.lunarMonth}`;
        if (!existingKeys.has(key)) {
          finalList.push(item);
          existingKeys.add(key);
        }
      }
    }

    // Lưu vào AsyncStorage
    const updatedDisplayList = await saveRawAnniversaries(finalList);

    // Cập nhật lại lịch thông báo
    try {
      await scheduleImportantDatesOnly(updatedDisplayList);
    } catch {
      // Không chặn luồng nếu thông báo lỗi
    }

    return {
      success: true,
      importedCount: validItems.length,
      totalCount: finalList.length,
      updatedList: updatedDisplayList,
      message: `Khôi phục thành công! Đã nạp ${validItems.length} ngày giỗ (Tổng cộng: ${finalList.length} ngày giỗ trong sổ).`,
    };
  } catch (error: any) {
    return {
      success: false,
      importedCount: 0,
      totalCount: 0,
      message: error?.message || 'Có lỗi xảy ra trong quá trình đọc tệp tin.',
    };
  }
}
