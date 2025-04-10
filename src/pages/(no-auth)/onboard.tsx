import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { t } from '@lingui/core/macro';
import Icon from '@/components/Icons';
import useAuthStore from '@/store/auth.slice';
import Toast from 'react-native-toast-message';
import { NRouter } from '@/@types/router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import OnboardForm from '@/modules/Auth/Onboard';
import PasswordAuthentication from '@/modules/Auth/LocalAuth/PasswordAuthentication';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'onboard'>;

const OnboardPage: React.FC<TProps> = ({ navigation }) => {
  const storeUser = useAuthStore(state => state.setUser);

  async function saveAccountInfo(username: string, password: string) {
    storeUser({ username });
    const auth = new PasswordAuthentication();

    try {
      await auth.saveCredentials(username, password);
      Toast.show({
        type: 'success',
        text1: t`Success`,
        text2: t`Account info saved successfully.`,
      });
      navigation.navigate('homepage');
    } catch (error) {
      console.log('Save account info error', error);

      Toast.show({
        type: 'error',
        text1: t`Error`,
        text2: t`Failed to save account info, please try again later.`,
      });
    }
  }

  return (
    <View className="h-full bg-white dark:bg-slate-800 justify-center px-6 flex-grow shrink basis-auto w-full">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} className="flex flex-col gap-y-5">
        <View className="flex flex-col justify-center gap-y-20 mt-10">
          <View className="flex flex-row justify-center w-full">
            <View className="bg-gray-200 dark:bg-white rounded-full p-5">
              <Icon name="camera" width={80} height={80} />
            </View>
          </View>
          <OnboardForm onSubmit={saveAccountInfo} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default OnboardPage;
