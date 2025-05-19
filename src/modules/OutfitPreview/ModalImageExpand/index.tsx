import { NImageService } from '@/@types/image-service';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, View } from 'react-native';

type TGeneratedImageResult = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;

interface IProps {
  isOpen: boolean;
  image?: TGeneratedImageResult;
  images: TGeneratedImageResult[];
  onClose: () => void;
}

const styles = StyleSheet.create({
  thumbnailsContainerHidden: {
    display: 'none',
  },

  closeIcon: {
    color: 'white',
  },
});

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
      <View className=" flex flex-col justify-center items-center bg-black/50 dark:bg-white/25 flex-auto">
        <View className="w-full flex items-center justify-center flex-auto py-3">
          <View className="relative h-auto">
            <Button
              className="absolute top-3 right-3 z-10 bg-slate-600/50 rounded-full"
              onClick={closeModal}>
              <Icon name="close" width={32} height={32} style={styles.closeIcon} />
            </Button>
            {activeImage && (
              <Image
                className="w-full aspect-square max-h-full max-w-full"
                source={{
                  uri: (activeImage?.data as { content: string }).content,
                }}
              />
            )}
          </View>
        </View>
        <View
          className="h-32 mt-auto px-4 mb-4"
          style={!images.length ? styles.thumbnailsContainerHidden : undefined}>
          <FlatList
            horizontal
            data={images}
            showsHorizontalScrollIndicator={false}
            extraData={image?.id}
            keyExtractor={item => String(item.id)}
            renderItem={({ item, index }) => {
              const isSelected = item.id === activeImage?.id;

              return (
                <Pressable onPress={() => changeSelectedImage(item)}>
                  <Image
                    className={`w-32 aspect-square rounded-lg border-4 border-solid ${index === images.length - 1 ? 'mr-0' : 'mr-3'} ${
                      isSelected ? 'border-white' : 'border-transparent'
                    }`}
                    source={{ uri: item.data.content }}
                  />
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

export default ModalImageExpand;
