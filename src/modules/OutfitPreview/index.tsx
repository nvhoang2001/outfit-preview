import Button from '@/components/Button';
import Icon from '@/components/Icons';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { type Asset } from 'react-native-image-picker';
import CustomImagePicker from './ImagePicker';

interface IProps {
  className?: string;
}

function OutfitPreview({ className }: IProps) {
  const [selectedImage, setSelectedImage] = useState<null | Asset>(null);
  const [selectedOutfitImage, setSelectedOutfitImage] = useState<null | Asset>(null);

  const isNoSelectImage = !selectedImage && !selectedOutfitImage;

  async function generateImage() {}

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
      </ScrollView>

      <View className="p-5">
        <Button
          disabled={isNoSelectImage}
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
