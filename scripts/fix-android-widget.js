const fs = require('fs');
const path = require('path');

// 1. Vá NativeAndroidWidget.js (module)
const nativeModulePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'lib',
  'module',
  'NativeAndroidWidget.js'
);

if (fs.existsSync(nativeModulePath)) {
  const content = `import { TurboModuleRegistry } from 'react-native';
const nativeMod = TurboModuleRegistry?.get ? TurboModuleRegistry.get('AndroidWidget') : null;
export default nativeMod;
`;
  fs.writeFileSync(nativeModulePath, content, 'utf8');
  console.log('Đã vá an toàn NativeAndroidWidget.js (module)');
}

// 2. Vá NativeAndroidWidget.js (commonjs)
const nativeCommonJsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'lib',
  'commonjs',
  'NativeAndroidWidget.js'
);

if (fs.existsSync(nativeCommonJsPath)) {
  const content = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var _reactNative = require("react-native");
var nativeMod = _reactNative.TurboModuleRegistry && _reactNative.TurboModuleRegistry.get ? _reactNative.TurboModuleRegistry.get('AndroidWidget') : null;
exports.default = nativeMod;
`;
  fs.writeFileSync(nativeCommonJsPath, content, 'utf8');
  console.log('Đã vá an toàn NativeAndroidWidget.js (commonjs)');
}

// 3. Vá AndroidWidget.js (module) để fallback về noopModule thay vì throw dummyModuleProxy gây crash app
const androidWidgetModulePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'lib',
  'module',
  'AndroidWidget.js'
);

if (fs.existsSync(androidWidgetModulePath)) {
  let content = fs.readFileSync(androidWidgetModulePath, 'utf8');
  content = content.replace(
    'AndroidWidgetModule ?? dummyModuleProxy',
    'AndroidWidgetModule || noopModule'
  );
  fs.writeFileSync(androidWidgetModulePath, content, 'utf8');
  console.log('Đã vá AndroidWidget.js (module) an toàn với Expo Go');
}

// 4. Vá AndroidWidget.js (commonjs)
const androidWidgetCommonJsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'lib',
  'commonjs',
  'AndroidWidget.js'
);

if (fs.existsSync(androidWidgetCommonJsPath)) {
  let content = fs.readFileSync(androidWidgetCommonJsPath, 'utf8');
  content = content.replace(
    'AndroidWidgetModule ?? dummyModuleProxy',
    'AndroidWidgetModule || noopModule'
  );
  fs.writeFileSync(androidWidgetCommonJsPath, content, 'utf8');
  console.log('Đã vá AndroidWidget.js (commonjs) an toàn với Expo Go');
}

// 5. Vá app.plugin.js: android:exported="true" cho AppWidgetProvider (bắt buộc trên Android 12+ / Xiaomi)
const appPluginPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'app.plugin.js'
);

if (fs.existsSync(appPluginPath)) {
  let content = fs.readFileSync(appPluginPath, 'utf8');
  if (content.includes("'android:exported': 'false'")) {
    content = content.replace(
      "'android:exported': 'false'",
      "'android:exported': 'true'"
    );
    fs.writeFileSync(appPluginPath, content, 'utf8');
    console.log('Đã vá app.plugin.js: android:exported="true" cho Widget Receiver');
  }
}

// 6. Vá src/NativeAndroidWidget.ts nếu có
const nativeTsPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-android-widget',
  'src',
  'NativeAndroidWidget.ts'
);

if (fs.existsSync(nativeTsPath)) {
  let content = fs.readFileSync(nativeTsPath, 'utf8');
  if (content.includes('TurboModuleRegistry.getEnforcing')) {
    content = content.replace(
      'TurboModuleRegistry.getEnforcing<Spec>(\'AndroidWidget\')',
      '(TurboModuleRegistry.get ? TurboModuleRegistry.get<Spec>(\'AndroidWidget\') : null) as any'
    );
    fs.writeFileSync(nativeTsPath, content, 'utf8');
    console.log('Đã vá src/NativeAndroidWidget.ts');
  }
}
