/**
 * @format
 */

import './gesture-handler';
import '@formatjs/intl-pluralrules/polyfill-force'; // instead of /polyfill
import '@formatjs/intl-locale/polyfill-force';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
