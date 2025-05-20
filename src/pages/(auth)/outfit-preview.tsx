import type { NRouter } from '@/@types/router';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import OutfitPreview from '@/modules/OutfitPreview';
import { getFileExtensionFromMimeType, getPictureDirPath } from '@/utils/assetsPathUtils';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { writeFile, exists, mkdir } from '@dr.pogodin/react-native-fs';
import React, { useRef } from 'react';
import { useLingui } from '@lingui/react/macro';
import Toast from 'react-native-toast-message';
import AdditionalCommands from '@/modules/OutfitPreview/AdditionalCommands';
import { NImageService } from '@/@types/image-service';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'outfit-preview'>;

function OutfitPreviewPage({ navigation }: TProps) {
  const { t } = useLingui();

  const rfPreviewManager = useRef<React.ComponentRef<typeof OutfitPreview>>(undefined);
  const rfCommandsController = useRef<React.ComponentRef<typeof AdditionalCommands>>(undefined);

  function goBack() {
    navigation.goBack();
  }

  function openAdditionalCommands() {
    rfCommandsController.current?.openDrawer(
      rfPreviewManager.current?.retrieveSelectedImages() ?? []
    );
  }

  async function storeImagesToDevices(
    images?: Exclude<NImageService.TGeneratedResult, { type: 'text' }>[]
  ) {
    if (!images) {
      return [];
    }

    const assetDirPath = getPictureDirPath();

    const hasCreatedAssetDir = await exists(assetDirPath);

    if (!hasCreatedAssetDir) {
      try {
        await mkdir(assetDirPath, {
          NSURLIsExcludedFromBackupKey: true,
        });
      } catch (error) {
        console.log('failed to create asset path', error);

        Toast.show({
          type: 'error',
          text1: t`Failed to store image`,
          text2: t`An unknow error occured, please try again`,
        });

        return;
      }
    }

    const fileCreationData = images.map(image => {
      const fileExtension = getFileExtensionFromMimeType(image.data.mimeType);
      const name = `outfit-try-on-${image.id}`;
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

    const storeResults = await Promise.allSettled(
      fileCreationData.map(fileData =>
        writeFile(fileData.filepath, fileData.data, fileData.encoding)
      )
    );

    const errorImages = storeResults.reduce<number[]>((list, result, index) => {
      if (result.status === 'rejected') {
        list.push(images[index].id);
      }

      return list;
    }, []);

    if (errorImages.length) {
      rfPreviewManager.current?.highlightSelectImage(errorImages);

      Toast.show({
        type: 'error',
        text1: t`Cannot save some images`,
        text2: t`The unsave images has been selected, please check that.`,
      });
    }
  }

  async function storeAllGeneratedImageToDevices() {
    const images = rfPreviewManager.current?.retrieveGeneratedImages();

    storeImagesToDevices(images);
  }

  function requestPromptUpdate() {
    rfPreviewManager.current?.openUpdatePromptModal();
  }

  function storeSelectedImageToDevices() {
    const images = rfPreviewManager.current?.retrieveGeneratedImages(
      rfPreviewManager.current?.retrieveSelectedImages()
    );

    storeImagesToDevices(images);
  }

  function removeAllGeneratedImage() {
    rfPreviewManager.current?.removeImages();
  }

  function removeSelectedImage() {
    rfPreviewManager.current?.removeImages(rfPreviewManager.current.retrieveSelectedImages());
  }

  return (
    <View className="h-full bg-white dark:bg-neutral-900">
      <View className="flex flex-row justify-between px-5 py-4">
        <Button onClick={goBack}>
          <Icon
            name="arrow-back"
            className="w-8 h-8 text-dark dark:text-white"
            width={32}
            height={32}
          />
        </Button>

        <View className="flex flex-row items-center gap-2">
          <Button
            className="w-8 h-8 justify-center items-center flex"
            onClick={openAdditionalCommands}>
            <Icon
              name="three-dots-circle"
              width={24}
              height={24}
              className="object-scale-down text-dark dark:text-white"
            />
          </Button>
        </View>
      </View>
      <OutfitPreview className="basis-auto grow shrink" ref={rfPreviewManager} />

      <AdditionalCommands
        ref={rfCommandsController}
        onSaveAllImage={storeAllGeneratedImageToDevices}
        onSaveSelected={storeSelectedImageToDevices}
        onDeleteAll={removeAllGeneratedImage}
        onDeleteSelected={removeSelectedImage}
        onOpenPromptModal={requestPromptUpdate}
      />
    </View>
  );
}

export default OutfitPreviewPage;
