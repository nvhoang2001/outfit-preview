/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppRouter from '@/router';
import I18nProvider from '@/modules/Localization/I18nProvider';

import '@/styles/global.css';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <I18nProvider>
      <SafeAreaView className="h-full">
        <AppRouter />
        <Toast />
      </SafeAreaView>
    </I18nProvider>
  );
}

export default App;
