import { NImageService } from '@/@types/image-service';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Pressable, View } from 'react-native';

type TGeneratedImageResult = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;

interface IProps {
  isOpen: boolean;
  image?: TGeneratedImageResult;
  images: TGeneratedImageResult[];
  onClose: () => void;
}

function ModalImageExpand({ isOpen, onClose, image, images }: IProps) {
  const [activeImage, setActiveImage] = useState<TGeneratedImageResult | undefined>();

  function changeSelectedImage(selectedImage: TGeneratedImageResult) {
    setActiveImage(selectedImage);
  }

  function closeModal() {
    setActiveImage(undefined);

    onClose();
  }

  useEffect(() => {
    if (isOpen && image) {
      setActiveImage(image);
    }
  }, [image, isOpen]);

  return (
    <Modal animationType="fade" transparent visible={isOpen} onRequestClose={closeModal}>
      <View className="relative flex flex-col justify-center items-center bg-black/50 dark:bg-white/25 flex-auto">
        <Button className="absolute top-5 right-5" onClick={closeModal}>
          <Icon name="close" />
        </Button>

        <View className="w-full flex-auto">
          {activeImage && (
            <Image
              source={{
                uri: (activeImage?.data as { content: string }).content,
              }}
            />
          )}
        </View>
        <FlatList
          className="h-11"
          horizontal
          data={images}
          extraData={image?.id}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => {
            const isSelected = item.id === activeImage?.id;

            return (
              <Pressable
                className={
                  isSelected
                    ? 'border border-solid border-white'
                    : 'border border-solid border-transparent'
                }
                onPress={() => changeSelectedImage(item)}>
                <Image className="w-10 h-10 rounded" source={{ uri: item.data.content }} />
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

export default ModalImageExpand;
