import Button from '@/components/Button';
import Icon from '@/components/Icons';
import { Trans } from '@lingui/react/macro';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { ScrollView, Text, View } from 'react-native';
import { type Asset } from 'react-native-image-picker';
import CustomImagePicker from './ImagePicker';
import BaseImageGenerate from '../ImageGenerate/BaseService';
import useSettingStore from '@/store/setting.slice';
import imageGenerateServiceFactory from '../ImageGenerate/ImageGenerateServiceFactory';
import { NImageService } from '@/@types/image-service';
import PreviewResultList from './PreviewResult';
import useModal from '@/hooks/useModal';
import ModalImageExpand from './ModalImageExpand';

type TGeneratedImageResult = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;
type TImageId = TGeneratedImageResult['id'];

interface IImperativeHandler {
  retrieveGeneratedImages: () => TGeneratedImageResult[];
}

interface IProps {
  className?: string;
  ref: RefObject<IImperativeHandler | undefined>;
}

function OutfitPreview({ className, ref }: IProps) {
  const expandImageModal = useModal<TGeneratedImageResult>();
  const currentModel = useSettingStore(state => state.activeModel);

  const rfInitPromise = useRef<Promise<void> | undefined>(undefined);

  const [activeImageGenerateService, setActiveImageGenerateService] = useState<BaseImageGenerate>();
  const [selectedOutfitImage, setSelectedOutfitImage] = useState<null | Asset>(null);
  const [selectedImage, setSelectedImage] = useState<null | Asset>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isInSelectionMode, setIsInSelectionMode] = useState(false);
  const [generateResults, setGenerateResults] = useState<
    NImageService.TGeneratedResult[] | undefined
  >(undefined);
  const [selectedImages, setSelectedImages] = useState<TImageId[]>([]);

  const isNoSelectImage = !selectedImage && !selectedOutfitImage;

  const generatedImages = useMemo<TGeneratedImageResult[]>(() => {
    if (!generateResults) {
      return [];
    }

    return generateResults.filter(item => item.type !== 'text');
  }, [generateResults]);

  async function generateImage() {
    setIsGeneratingImage(true);

    try {
      if (rfInitPromise.current) {
        await rfInitPromise.current;
      }

      const generatedImageResult = await activeImageGenerateService?.generateImage();

      setGenerateResults(generatedImageResult);
    } catch (error) {
      console.log('Generate error: ', error);
    } finally {
      setIsGeneratingImage(false);
    }
  }

  function selectImage(imageId: TImageId) {
    const isSelected = selectedImages.includes(imageId);

    if (isSelected) {
      setIsInSelectionMode(true);
    }

    setSelectedImages(
      isSelected
        ? selectedImages.filter(image => image !== imageId)
        : selectedImages.concat(imageId)
    );
  }

  function expandImage(imageId: TImageId) {
    expandImageModal.openModal(generatedImages.find(image => image.id === imageId));
  }

  function exitSelectionModel() {
    setIsInSelectionMode(false);
  }

  const retrieveGeneratedImages = useCallback(() => {
    return generatedImages;
  }, [generatedImages]);

  useImperativeHandle(ref, () => {
    return { retrieveGeneratedImages };
  }, [retrieveGeneratedImages]);

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

    createModelService();
  }, [currentModel]);

  return (
    <View className={className}>
      <ModalImageExpand
        images={generatedImages}
        isOpen={expandImageModal.isOpen}
        onClose={expandImageModal.closeModal}
        image={expandImageModal.data}
      />

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

        <PreviewResultList
          isInSelectionMode={isInSelectionMode}
          results={generatedImages}
          selectImages={selectedImages}
          isLoading={isGeneratingImage}
          onSelectImage={selectImage}
          onExpandImage={expandImage}
          onExitSelectionMode={exitSelectionModel}
        />
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
