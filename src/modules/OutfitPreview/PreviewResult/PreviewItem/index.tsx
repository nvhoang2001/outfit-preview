import type { NImageService } from '@/@types/image-service';
import Icon from '@/components/Icons';
import type { ComponentPropsWithRef } from 'react';
import { Animated, Image, Pressable, View } from 'react-native';

interface IProps extends Animated.AnimatedProps<ComponentPropsWithRef<typeof Image>> {
  isSelecting: boolean;
  showSelectBox: boolean;
  itemId: NImageService.TGeneratedResult['id'];
  onExpandImage: (image: NImageService.TGeneratedResult['id']) => void;
  onSelectImage: (image: NImageService.TGeneratedResult['id']) => void;
}

function PreviewItem({
  itemId,
  showSelectBox,
  isSelecting,
  onExpandImage,
  onSelectImage,
  ...props
}: IProps) {
  return (
    <View className="relative">
      <Pressable
        onPress={() => onSelectImage(itemId)}
        className={`${showSelectBox ? 'opacity-100' : 'opacity-0'} absolute top-2 right-2 border border-solid border-white rounded-full z-10 bg-white/50`}>
        <View className={isSelecting ? 'opacity-100' : 'opacity-0'}>
          <Icon name="tick" width={16} height={16} />
        </View>
      </Pressable>
      <Pressable onPress={() => onExpandImage(itemId)} onLongPress={() => onSelectImage(itemId)}>
        <Animated.Image {...props} />
      </Pressable>
    </View>
  );
}

export default PreviewItem;
