import { NImageService } from '@/@types/image-service';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import PreviewItem from './PreviewItem';
import { Trans, Plural } from '@lingui/react/macro';
import Button from '@/components/Button';
import { ResponsiveGrid } from 'react-native-flexible-grid';

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
    <View className="h-full mt-5">
      {isInSelectionMode && (
        <View className="flex flex-row justify-between items-center mb-5">
          <Text className="text-dark dark:text-white">
            <Plural
              value={selectImages.length}
              _1="Select item: # item"
              _0="Select item: # item"
              other="Select items: # items"
            />
          </Text>

          <Button className="rounded-none" onClick={onExitSelectionMode}>
            <Text className="text-dark dark:text-white">
              <Trans>Clear selection</Trans>
            </Text>
          </Button>
        </View>
      )}

      <View className="h-full max-w-full px-0">
        <ResponsiveGrid
          keyExtractor={item => item.id}
          data={results}
          maxItemsPerColumn={3}
          renderItem={({ item: image, index: i }) => {
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
                className="w-full aspect-square border-4 border-solid border-transparent"
                style={{
                  opacity: animationValues.current[i] ?? 0,
                  transform: [
                    {
                      translateY:
                        animationValues.current[i]?.interpolate?.({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }) ?? 20,
                    },
                  ],
                }}
                onError={err => {
                  console.log(err);
                }}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

export default PreviewResultList;
