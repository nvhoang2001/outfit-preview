import { View, Text, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NRouter } from '@/@types/router';
import { Trans } from '@lingui/react/macro';
import useAuthStore from '@/store/auth.slice';
import Icon from '@/components/Icons';
import Button from '@/components/Button';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'homepage'>;

const Homepage: React.FC<TProps> = ({ navigation }) => {
  const userData = useAuthStore(state => state.user);

  function navigateToCameraPage() {
    navigation.push('outfit-preview');
  }

  return (
    <View className="h-full bg-white dark:bg-black px-5 py-6">
      <View className="flex flex-row justify-between mb-10">
        <Text className="text-2xl font-normal">
          <Trans>Welcome, {userData?.username}</Trans>
        </Text>

        <View className="flex flex-row gap-x-4">
          <Pressable>
            <Icon name="search" width={24} height={24} />
          </Pressable>
          <Pressable>
            <Icon name="bar" width={24} height={24} />
          </Pressable>
        </View>
      </View>

      <View className="flex flex-row gap-5 px-4 mb-5">
        <View>
          <Button className="p-4 w-fit bg-slate-100" onClick={navigateToCameraPage}>
            <Icon name="camera-shutter" width={24} height={24} />
          </Button>
          <Text className="text-base mt-2">
            <Trans>Camera</Trans>
          </Text>
        </View>
      </View>

      <View className="flex flex-row justify-between items-center">
        <Text className="text-base">
          <Trans>Recent Edit</Trans>
        </Text>

        <Pressable>
          <Text>See more</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Homepage;
