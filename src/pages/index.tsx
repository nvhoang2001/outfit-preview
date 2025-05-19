import { EConfigKeys } from '@/constants/config';
import { locales as supportedLocaleLangs } from '@/constants/locales';
import BiometricAuthentication from '@/modules/Auth/LocalAuth/BiometricAuthentication';
import useAuthStore from '@/store/auth.slice';
import useSettingStore from '@/store/setting.slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  useAnimatedValue,
  View,
  Settings,
  I18nManager,
} from 'react-native';
import CameraIcon from '@/assets/images/icons/camera.svg';
import { retrieveUserInfo } from '@/utils/retrieveUserInfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NRouter } from '@/@types/router';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'index'>;

const StartScreen: React.FC<TProps> = ({ navigation }) => {
  const scaleAnimateValue = useAnimatedValue(0);

  const [isLoadedData, setIsLoadedData] = useState(false);

  const isLoggedIn = useAuthStore(state => state.isSignedIn);
  const userData = useAuthStore(state => state.user);
  const currentLocale = useSettingStore(state => state.localeLang);

  const updateUser = useAuthStore(state => state.setUser);
  const updateActiveLocaleLang = useSettingStore(state => state.setActiveLocaleLang);
  const updateBiometricAvailability = useAuthStore(state => state.setCanUseBiometric);

  const isOnboarded = Boolean(userData);

  async function getUserInfo() {
    const userInfo = await retrieveUserInfo();

    if (userInfo) {
      updateUser(userInfo);
    }
  }

  async function checkBiometricAvailability() {
    const isAvailable = await BiometricAuthentication.isBiometricAvailable();
    updateBiometricAvailability(isAvailable);
  }

  async function checkActiveLocaleLang() {
    const activeLocaleLang = await AsyncStorage.getItem(EConfigKeys.ACTIVE_LANG);

    if (activeLocaleLang && activeLocaleLang !== currentLocale) {
      updateActiveLocaleLang(activeLocaleLang.toLowerCase());
    }

    let deviceLocaleLang = 'en';

    if (Platform.OS === 'ios') {
      const locale = Settings.get('AppleLocale') || Settings.get('AppleLanguages')[0];

      if (locale) {
        deviceLocaleLang = locale.toLowerCase();
      }
    } else {
      const locale = I18nManager.getConstants().localeIdentifier;

      if (locale) {
        deviceLocaleLang = locale.toLowerCase();
      }
    }

    if (
      !activeLocaleLang &&
      deviceLocaleLang !== currentLocale &&
      supportedLocaleLangs.includes(deviceLocaleLang as 'en' | 'vi')
    ) {
      updateActiveLocaleLang(deviceLocaleLang);
    }
  }

  function onboardingAnimation() {
    Animated.timing(scaleAnimateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  }

  async function loadSupportedLocalesPluralsConfig() {
    await Promise.allSettled([
      import(`@formatjs/intl-pluralrules/locale-data/en`),
      import(`@formatjs/intl-pluralrules/locale-data/vi`),
    ]);
  }

  async function initAppData() {
    const minLoad = new Promise<void>(resolve => setTimeout(resolve, 1000));
    const task = [
      checkBiometricAvailability(),
      checkActiveLocaleLang(),
      getUserInfo(),
      loadSupportedLocalesPluralsConfig(),
      minLoad,
    ];
    try {
      await Promise.all(task);

      setIsLoadedData(true);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  useEffect(() => {
    if (isLoadedData) {
      if (isLoggedIn) {
        navigation.replace('homepage');
      } else {
        if (isOnboarded) {
          navigation.replace('login');
        } else {
          navigation.replace('onboard');
        }
      }
    }
  }, [isLoadedData]);

  useEffect(() => {
    initAppData();
    onboardingAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View className="flex flex-col justify-center items-center h-full bg-white dark:bg-black">
      <Animated.View
        className="rounded-full border-2 border-black dark:border-white"
        style={{
          transform: [{ scale: scaleAnimateValue }],
        }}>
        <View className="p-10 rounded-full bg-black/20 dark:bg-white">
          <CameraIcon width={80} height={80} fill="currentColor" />
        </View>
      </Animated.View>
    </View>
  );
};

export default StartScreen;
