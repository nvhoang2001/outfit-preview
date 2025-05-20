import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NRouter } from '@/@types/router';
import { Trans } from '@lingui/react/macro';
import useAuthStore from '@/store/auth.slice';
import Icon from '@/components/Icons';
import Button from '@/components/Button';
import useProjectSlice from '@/store/project.slice';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'homepage'>;

const Homepage: React.FC<TProps> = ({ navigation }) => {
  const userData = useAuthStore(state => state.user);
  const wipList = useProjectSlice(state => state.wips);

  function navigateToCameraPage() {
    navigation.push('outfit-preview');
  }

  return (
    <View className="h-full bg-white dark:bg-neutral-900 px-5 py-6">
      <View className="flex flex-row justify-between mb-10">
        <Text className="text-2xl font-normal text-dark dark:text-white">
          <Trans>Welcome, {userData?.username}</Trans>
        </Text>

        <View className="flex flex-row gap-x-4">
          <Button>
            <Icon className="text-dark dark:text-white" name="bar" width={24} height={24} />
          </Button>
        </View>
      </View>

      <View className="flex flex-row gap-5 px-4 mb-5">
        <View>
          <Button className="rounded-none" onClick={navigateToCameraPage}>
            <View className="p-4 w-fit bg-slate-100 rounded-md">
              <Icon name="camera-shutter" width={24} height={24} />
            </View>
            <Text className="text-base mt-2 text-dark dark:text-white">
              <Trans>Camera</Trans>
            </Text>
          </Button>
        </View>
      </View>

      {Boolean(wipList.length) && (
        <View className="flex flex-row justify-between items-center my-4">
          <Text className="text-base">
            <Trans>Recent Edit</Trans>
          </Text>
        </View>
      )}
    </View>
  );
};

export default Homepage;
