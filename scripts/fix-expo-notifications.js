const fs = require('fs');
const path = require('path');

const targetFile = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-notifications',
  'build',
  'TopicSubscriptionModule.android.js'
);

if (fs.existsSync(targetFile)) {
  const safeContent = `import { requireOptionalNativeModule } from 'expo';
const nativeModule = typeof requireOptionalNativeModule === 'function' ? requireOptionalNativeModule('ExpoTopicSubscriptionModule') : null;
const fallbackModule = {
  addListener: () => {},
  removeListeners: () => {},
  subscribeToTopicAsync: () => Promise.resolve(),
  unsubscribeFromTopicAsync: () => Promise.resolve(),
};
export default nativeModule || fallbackModule;
`;
  fs.writeFileSync(targetFile, safeContent, 'utf8');
  console.log('✅ Đã vá an toàn module ExpoTopicSubscriptionModule cho Expo Go!');
}
