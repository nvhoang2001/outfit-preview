import { NRouter } from '@/@types/router';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import OutfitPreview from '@/modules/OutfitPreview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'outfit-preview'>;

function OutfitPreviewPage({ navigation }: TProps) {
  function goBack() {
    navigation.goBack();
  }

  return (
    <View className="h-full bg-white dark:bg-black">
      <View className="flex flex-row justify-between px-5 py-4">
        <Button onClick={goBack}>
          <Icon name="arrow-back" className="w-5 h-5" width={32} height={32} />
        </Button>

        <View className="flex flex-row items-center gap-2">
          <Button className="w-8 h-8 justify-center items-center flex">
            <Icon name="save-item" className="object-scale-down" width={20} height={20} />
          </Button>
          <Button className="w-8 h-8 justify-center items-center flex">
            <Icon name="three-dots-circle" width={24} height={24} className="object-scale-down" />
          </Button>
        </View>
      </View>
      <OutfitPreview className="basis-auto grow shrink" />
    </View>
  );
}

export default OutfitPreviewPage;
