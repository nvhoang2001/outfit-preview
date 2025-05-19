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
import { intersectionWith as _intersectionWith, differenceWith as _differenceWith } from 'lodash';
import ModalUpdatePrompt from './ModalUpdatePrompt';

type TGeneratedImageResult = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;
type TImageId = TGeneratedImageResult['id'];

type TExpandImageModal = {
  images: TGeneratedImageResult[];
  expandImage: TGeneratedImageResult;
};

interface IImperativeHandler {
  retrieveGeneratedImages: (imageId?: TImageId[]) => TGeneratedImageResult[];
  highlightSelectImage: (imageId: TImageId[]) => void;
  retrieveSelectedImages: () => TImageId[];
  openUpdatePromptModal: () => void;
  removeImages: (ids?: TImageId[]) => void;
}

interface IProps {
  className?: string;
  ref: RefObject<IImperativeHandler | undefined>;
}

function OutfitPreview({ className, ref }: IProps) {
  const promptModal = useModal<string>();
  const expandImageModal = useModal<Partial<TExpandImageModal>>();
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

  function selectImageFromGeneratedImagesList(imageId: TImageId) {
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

  function expandImageFromGeneratedImagesList(imageId: TImageId) {
    const expandImage = generatedImages.find(image => image.id === imageId) ?? undefined;

    expandImageModal.openModal({
      expandImage,
      images: generatedImages,
    });
  }

  function exitSelectionModel() {
    setIsInSelectionMode(false);
    setSelectedImages([]);
  }

  function expandPickedImage(image: Asset) {
    expandImageModal.openModal({
      images: [],
      expandImage: {
        id: 1,
        data: {
          content: image.uri!,
          mimeType: image.type!,
        },
        type: 'image',
      },
    });
  }

  const retrieveGeneratedImages = useCallback(
    (ids?: TImageId[]) => {
      if (!ids?.length) {
        return generatedImages;
      }

      return generatedImages.filter(image => ids.includes(image.id));
    },
    [generatedImages]
  );

  const highlightSelectImage = useCallback((imageId: TImageId[]) => {
    setIsInSelectionMode(true);
    setSelectedImages(imageId);
  }, []);

  const retrieveSelectedImages = useCallback(() => {
    return selectedImages;
  }, [selectedImages]);

  const removeImages = useCallback((ids?: TImageId[]) => {
    setSelectedImages([]);

    if (!ids?.length) {
      setGenerateResults([]);

      return;
    }

    return setGenerateResults(images => (images ?? [])?.filter(image => !ids.includes(image.id)));
  }, []);

  const openUpdatePromptModal = useCallback(() => {
    return promptModal.openModal(activeImageGenerateService?.getConfig('prompt') as string);
  }, [activeImageGenerateService, promptModal]);

  function confirmUpdatePrompt(prompt: string) {
    activeImageGenerateService?.changeConfig('prompt', prompt);
  }

  function restoreImageGenerationPrompt() {
    activeImageGenerateService?.changeConfig(
      'prompt',
      'Generate a high-quality virtual try-on image showing the person wearing the clothing from the second image. Preserve all facial features, hairstyle, skin tone, body proportions, pose, and background.'
    );
  }

  useImperativeHandle(ref, () => {
    return {
      retrieveGeneratedImages,
      highlightSelectImage,
      retrieveSelectedImages,
      openUpdatePromptModal,
      removeImages,
    };
  }, [
    highlightSelectImage,
    openUpdatePromptModal,
    retrieveGeneratedImages,
    retrieveSelectedImages,
    removeImages,
  ]);

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
        images={expandImageModal.data?.images ?? []}
        isOpen={expandImageModal.isOpen}
        onClose={expandImageModal.closeModal}
        image={expandImageModal.data?.expandImage}
      />

      <ModalUpdatePrompt
        isOpen={promptModal.isOpen}
        savedPrompt={promptModal.data ?? ''}
        onClose={promptModal.closeModal}
        onConfirm={confirmUpdatePrompt}
        onRestorePrompt={restoreImageGenerationPrompt}
      />

      <ScrollView className="px-5">
        <View className="flex flex-row justify-center gap-5 w-full">
          <CustomImagePicker
            asset={selectedImage}
            onExpandFile={expandPickedImage}
            onSelectFile={setSelectedImage}
          />
          <CustomImagePicker
            asset={selectedOutfitImage}
            onExpandFile={expandPickedImage}
            onSelectFile={setSelectedOutfitImage}
          />
        </View>

        <View className="my-5" />

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
          onSelectImage={selectImageFromGeneratedImagesList}
          onExpandImage={expandImageFromGeneratedImagesList}
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
