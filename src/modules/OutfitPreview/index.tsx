import Button from '@/components/Button';
import Icon from '@/components/Icons';
import { Trans } from '@lingui/react/macro';
import { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { type Asset } from 'react-native-image-picker';
import CustomImagePicker from './ImagePicker';
import BaseImageGenerate from '../ImageGenerate/BaseService';
import useSettingStore from '@/store/setting.slice';
import imageGenerateServiceFactory from '../ImageGenerate/ImageGenerateServiceFactory';

interface IProps {
  className?: string;
}

function OutfitPreview({ className }: IProps) {
  const currentModel = useSettingStore(state => state.activeModel);

  const rfInitPromise = useRef<Promise<void> | undefined>(undefined);

  const [activeImageGenerateService, setActiveImageGenerateService] = useState<BaseImageGenerate>();
  const [selectedImage, setSelectedImage] = useState<null | Asset>(null);
  const [selectedOutfitImage, setSelectedOutfitImage] = useState<null | Asset>(null);
  const [generateResults, setGenerateResults] = useState<string[]>([]);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const isNoSelectImage = !selectedImage && !selectedOutfitImage;

  async function generateImage() {
    setIsGeneratingImage(true);

    try {
      if (rfInitPromise.current) {
        await rfInitPromise.current;
      }

      const generatedImageResult = await activeImageGenerateService?.generateImage();

      console.log('result: ', generatedImageResult);

      setGenerateResults(
        (generatedImageResult || [])
          .map(item =>
            item.type === 'image' ? `data:${item.data.mimeType};base64,${item.data.content}` : ''
          )
          .filter(Boolean)
      );
    } catch (error) {
      console.log('Generate error: ', error);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  useEffect(() => {
    if (selectedImage && selectedOutfitImage) {
      rfInitPromise.current = activeImageGenerateService
        ?.initData(selectedImage, selectedOutfitImage)
        .then(() => {
          rfInitPromise.current = undefined;
        });
    }
  }, [activeImageGenerateService, selectedImage, selectedOutfitImage]);

  useEffect(() => {
    async function createModelService() {
      try {
        const activeImageHandlingService =
          await imageGenerateServiceFactory.createServiceModel(currentModel);

        setActiveImageGenerateService(activeImageHandlingService);
      } catch (error) {
        console.log('createModelService', error);
      }
    }
    console.log('Active model', currentModel);

    createModelService();
  }, [currentModel]);

  return (
    <View className={className}>
      <ScrollView className="px-6">
        <View className="flex flex-row justify-center gap-5">
          <CustomImagePicker asset={selectedImage} onSelectFile={setSelectedImage} />
          <CustomImagePicker asset={selectedOutfitImage} onSelectFile={setSelectedOutfitImage} />
        </View>

        <View
          className="flex justify-center items-center"
          style={{
            transform: [
              {
                rotate: '180deg',
              },
            ],
          }}>
          <Icon width={24} height={24} name="merge" />
        </View>

        {isNoSelectImage && (
          <View className="flex flex-col items-center justify-center mt-20 py-15 border border-dotted border-gray-600 bg-gray-200/50 rounded-lg">
            <Icon name="empty-box" width={64} height={64} />

            <Text className="text-gray-800 dark:text-white text-sm">
              <Trans>No selected items, pick one to proceed</Trans>
            </Text>
          </View>
        )}

        <View className="flex flex-row max-w-full flex-wrap mt-5 gap-1">
          {generateResults.length &&
            generateResults.map((image, i) => (
              <Image
                key={i}
                source={{ uri: image }}
                width={150}
                height={150}
                className="w-1/3 grow-[33%] shrink-[33%] basis-auto  aspect-square"
              />
            ))}
        </View>
      </ScrollView>

      <View className="p-5">
        <Button
          disabled={!selectedImage || !selectedOutfitImage || isGeneratingImage}
          className="px-4 py-3 w-full bg-blue-400 disabled:bg-gray-300"
          onClick={generateImage}>
          <Text className="text-white text-center text-lg">
            <Trans>Generate image</Trans>
          </Text>
        </Button>
      </View>
    </View>
  );
}

export default OutfitPreview;
