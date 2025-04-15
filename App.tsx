/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import AppRouter from './src/router';
import I18nProvider from './src/modules/Localization/I18nProvider';
import SafeView from './src/components/SafeView';

import './src/styles/global.css';

function App() {
  return (
    <I18nProvider>
      <SafeAreaProvider>
        <SafeView style={{ height: '100%' }}>
          <AppRouter />
          <Toast />
        </SafeView>
      </SafeAreaProvider>
    </I18nProvider>
  );
}

export default App;
