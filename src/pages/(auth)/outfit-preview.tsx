import type { NRouter } from '@/@types/router';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import OutfitPreview from '@/modules/OutfitPreview';
import { getFileExtensionFromMimeType, getPictureDirPath } from '@/utils/assetsPathUtils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { writeFile } from '@dr.pogodin/react-native-fs';
import { useRef } from 'react';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'outfit-preview'>;

function OutfitPreviewPage({ navigation }: TProps) {
  const rfPreviewManager = useRef<React.ComponentRef<typeof OutfitPreview>>(undefined);

  function goBack() {
    navigation.goBack();
  }

  function storeImagesToDevices() {
    const images = rfPreviewManager.current?.retrieveGeneratedImages();

    if (!images) {
      return [];
    }

    const fileCreationData = images.map(image => {
      const assetDirPath = getPictureDirPath();
      const fileExtension = getFileExtensionFromMimeType(image.data.mimeType);
      const name = `outfit-tryon-${image.id}`;
      const filepath = `${assetDirPath}/${name}.${fileExtension}`;
      const data = image.data.content.slice(
        image.data.content.indexOf('base64,') + 'base64,'.length
      );

      return {
        filepath,
        data,
        encoding: 'base64' as const,
      };
    });

    return Promise.allSettled(
      fileCreationData.map(fileData =>
        writeFile(fileData.filepath, fileData.data, fileData.encoding)
      )
    );
  }

  return (
    <View className="h-full bg-white dark:bg-black">
      <View className="flex flex-row justify-between px-5 py-4">
        <Button onClick={goBack}>
          <Icon name="arrow-back" className="w-5 h-5" width={32} height={32} />
        </Button>

        <View className="flex flex-row items-center gap-2">
          <Button
            className="w-8 h-8 justify-center items-center flex"
            onClick={storeImagesToDevices}>
            <Icon name="save-item" className="object-scale-down" width={20} height={20} />
          </Button>

          <Button className="w-8 h-8 justify-center items-center flex">
            <Icon name="three-dots-circle" width={24} height={24} className="object-scale-down" />
          </Button>
        </View>
      </View>
      <OutfitPreview className="basis-auto grow shrink" ref={rfPreviewManager} />
    </View>
  );
}

export default OutfitPreviewPage;
