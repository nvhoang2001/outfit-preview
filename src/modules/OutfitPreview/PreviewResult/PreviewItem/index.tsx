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
    <Pressable
      className="relative"
      onPress={() => onExpandImage(itemId)}
      onLongPress={() => onSelectImage(itemId)}>
      <View className="absolute top-1 right-1 border border-solid border-white rounded-full">
        <Icon name="tick" className={isSelecting ? 'opacity-100' : 'opacity-0'} />
      </View>

      <Animated.Image {...props} />
    </Pressable>
  );
}

export default Animated.createAnimatedComponent(PreviewItem);
