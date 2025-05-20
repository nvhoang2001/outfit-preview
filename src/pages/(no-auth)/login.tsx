import { View, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { NRouter } from '@/@types/router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useAuthStore from '@/store/auth.slice';
import LoginForm from '@/modules/Auth/Login';
import Icon from '@/components/Icons';
import PasswordAuthentication from '@/modules/Auth/LocalAuth/PasswordAuthentication';
import Toast from 'react-native-toast-message';
import { Trans, useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import BiometricAuthentication from '@/modules/Auth/LocalAuth/BiometricAuthentication';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'login'>;

const LoginPage: React.FC<TProps> = ({ navigation }) => {
  const username = useAuthStore(state => state.user!.username);
  const { t } = useLingui();
  const [authInstance, setAuthInstance] = useState<PasswordAuthentication | undefined>();

  async function signInWithPassword(password: string) {
    try {
      await authInstance!.signIn(password);

      Toast.show({
        type: 'success',
        text1: t`Success`,
        text2: t`Welcome back, ${{ username }}`,
      });

      navigation.replace('homepage');
    } catch (error) {
      const typedError = error as Error;
      const errorMessage = typedError.message || t`Unknown error occured. Please try again`;

      Toast.show({
        type: 'error',
        text1: t`Login failed`,
        text2: errorMessage,
      });
    }
  }

  async function signInWithBiometric() {
    await authInstance!.signIn();
  }

  function clearUserAccountInfo() {
    authInstance!.clearCredentials();
    navigation.replace('onboard');
  }

  useEffect(() => {
    async function initAuthInstance() {
      const hasStoredBiometricData = await BiometricAuthentication.hasStoredCredentials();

      setAuthInstance(
        hasStoredBiometricData ? new BiometricAuthentication() : new PasswordAuthentication()
      );
    }

    initAuthInstance();
  }, []);

  return (
    <View className="h-full bg-white dark:bg-neutral-900">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex flex-col justify-end h-full pb-12 px-6">
          <View className="flex flex-row justify-center w-full">
            <View className="bg-gray-200 dark:bg-white rounded-full p-5">
              <Icon name="camera" width={80} height={80} />
            </View>
          </View>
          <View className="my-5">
            <Text className="text-2xl font-semibold text-center text-dark dark:text-white">
              <Trans>Welcome back, {username}</Trans>
            </Text>
            <Text className="text-base text-center mt-4 text-dark dark:text-white">
              <Trans>Login to your account</Trans>
            </Text>
          </View>

          <LoginForm
            onSubmit={signInWithPassword}
            onResetPassword={clearUserAccountInfo}
            onSignInWithBiometric={signInWithBiometric}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default LoginPage;
