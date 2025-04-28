import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { launchImageLibrary, type Asset } from 'react-native-image-picker';
import { useLingui } from '@lingui/react/macro';
import Toast from 'react-native-toast-message';
import Icon from '@/components/Icons';

interface ImagePickerProps {
  asset: Asset | null;
  onSelectFile: (asset: Asset | null) => void;
}

const CustomImagePicker: React.FC<ImagePickerProps> = ({ asset, onSelectFile }) => {
  const { t } = useLingui();

  const openImagePicker = async () => {
    const pickerResult = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    const permissionGranted = pickerResult.errorCode !== 'permission';

    if (!permissionGranted) {
      Toast.show({
        type: 'error',
        text1: t`Failed to launch image picker`,
        text2: t`Permission to access the gallery is required!`,
      });
      return;
    }

    if (pickerResult.assets) {
      onSelectFile(pickerResult.assets[0]);
    }
  };

  return (
    <View className="flex justify-center items-center w-1/2">
      <TouchableOpacity
        className="rounded-lg border border-solid border-gray-200 flex justify-center items-center overflow-hidden w-full aspect-square"
        onPress={openImagePicker}>
        {asset ? (
          <Image source={{ uri: asset.uri }} className="w-full h-full" />
        ) : (
          <Icon name="plus" width={50} height={50} className="" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomImagePicker;
