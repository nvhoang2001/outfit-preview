import { NImageService } from '@/@types/image-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import PreviewItem from './PreviewItem';
import { Trans } from '@lingui/react/macro';
import Button from '@/components/Button';

type TGeneratedImageResult = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;

interface IProps {
  results: TGeneratedImageResult[];
  isLoading: boolean;
  isInSelectionMode: boolean;
  selectImages: TGeneratedImageResult['id'][];
  onExpandImage: (image: TGeneratedImageResult['id']) => void;
  onSelectImage: (image: TGeneratedImageResult['id']) => void;
  onExitSelectionMode: () => void;
}

function PreviewResultList({
  results,
  isLoading,
  selectImages,
  isInSelectionMode,
  onExpandImage,
  onSelectImage,
  onExitSelectionMode,
}: IProps) {
  const animationValues = useRef<Animated.Value[]>([]);

  const [isActivateShowImageAnimation, setIsActivateShowImageAnimation] = useState(false);

  const isSuccess = results && !isLoading;

  const initShowupAnimation = useCallback(() => {
    animationValues.current = results.map(() => new Animated.Value(0));

    function startAnimation(index: number) {
      if (animationValues.current.length > index && animationValues.current[index]) {
        Animated.timing(animationValues.current[index], {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          startAnimation(index + 1);
        });
      }
    }

    startAnimation(0);
  }, [results]);

  useEffect(() => {
    if (isSuccess) {
      setIsActivateShowImageAnimation(isActivateShowImageAnimation);

      initShowupAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
  return (
    <View>
      <View className="flex flex-row justify-between items-center">
        <Text>
          <Trans>Select items</Trans>
        </Text>
        <Button onClick={onExitSelectionMode}>
          <Text>
            <Trans>Cancel selection</Trans>
          </Text>
        </Button>
      </View>
      <View className="flex flex-row max-w-full flex-wrap mt-5 gap-1">
        {results.map((image, i) => {
          const isSelecting = selectImages.includes(image.id);

          return (
            <PreviewItem
              itemId={image.id}
              isSelecting={isSelecting}
              showSelectBox={isInSelectionMode}
              onExpandImage={onExpandImage}
              onSelectImage={onSelectImage}
              source={{
                uri: image.data.content,
              }}
              style={{
                opacity: animationValues.current[i],
                transform: [
                  {
                    translateY: animationValues.current[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export default PreviewResultList;
