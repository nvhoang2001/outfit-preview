import BottomDrawer from '@/components/BottomDrawer';
import Button from '@/components/Button';
import Icon from '@/components/Icons';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Plural, Trans } from '@lingui/react/macro';
import { RefObject, useImperativeHandle, useRef, useState } from 'react';
import { Text, View } from 'react-native';

interface IExposedMethods {
  openDrawer: (imageIds: number[]) => void;
}

interface IProps {
  onSaveAllImage: () => void;
  onSaveSelected: () => void;
  onDeleteSelected: () => void;
  onDeleteAll: () => void;
  onOpenPromptModal: () => void;
  ref: RefObject<IExposedMethods | undefined>;
}

const COMMANDS = {
  SAVE_ALL: 'SAVE_ALL',
  DELETE_ALL: 'DELETE_ALL',
  SAVE_SELECTED: 'SAVE_SELECTED',
  DELETE_SELECTED: 'DELETE_SELECTED',
  UPDATE_PROMPT: 'UPDATE_PROMPT',
} as const;

function AdditionalCommands({
  onSaveAllImage,
  onOpenPromptModal,
  onDeleteAll,
  onDeleteSelected,
  onSaveSelected,
  ref,
}: IProps) {
  const rfBottomSheet = useRef<BottomSheetModal>(null);

  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  function eventController(command: string) {
    switch (command) {
      case COMMANDS.SAVE_ALL:
        onSaveAllImage();

        break;

      case COMMANDS.DELETE_ALL:
        onDeleteAll();

        break;

      case COMMANDS.SAVE_SELECTED:
        onSaveSelected();

        break;

      case COMMANDS.DELETE_SELECTED:
        onDeleteSelected();

        break;
      case COMMANDS.UPDATE_PROMPT:
        onOpenPromptModal();

        break;

      default:
        break;
    }

    setSelectedImages([]);
    rfBottomSheet.current?.dismiss();
  }

  useImperativeHandle(ref, () => {
    return {
      openDrawer(imageIds) {
        setSelectedImages(imageIds);
        rfBottomSheet.current?.present();
      },
    };
  }, []);

  return (
    <BottomDrawer enableDismissOnClose name="outfit-preview-page-commands" ref={rfBottomSheet}>
      <View className="py-5 px-1 flex flex-col gap-y-2">
        {Boolean(selectedImages.length) && (
          <>
            <Button
              id={COMMANDS.SAVE_SELECTED}
              className="w-full px-4 py-2 justify-start items-center flex flex-row gap-x-4"
              onClick={() => eventController(COMMANDS.SAVE_SELECTED)}>
              <Icon name="save-item" className="object-scale-down" width={20} height={20} />
              <Text>
                <Plural
                  value={selectedImages.length}
                  _1="Save selected image"
                  other="Save selected images (# items)"
                />
              </Text>
            </Button>
            <Button
              id={COMMANDS.DELETE_SELECTED}
              className="w-full px-4 py-2 justify-start items-center flex flex-row gap-x-4"
              onClick={() => eventController(COMMANDS.DELETE_SELECTED)}>
              <Icon name="trash" className="object-scale-down" width={20} height={20} />
              <Text>
                <Plural
                  value={selectedImages.length}
                  _1="Remove selected image"
                  other="Remove selected images (# items)"
                />
              </Text>
            </Button>
          </>
        )}

        <Button
          id={COMMANDS.SAVE_ALL}
          className="w-full px-4 py-2 justify-start items-center flex flex-row gap-x-4"
          onClick={() => eventController(COMMANDS.SAVE_ALL)}>
          <Icon name="save-item" className="object-scale-down" width={20} height={20} />
          <Text>
            <Trans>Save all images</Trans>
          </Text>
        </Button>
        <Button
          id={COMMANDS.DELETE_ALL}
          className="w-full px-4 py-2 justify-start items-center flex flex-row gap-x-4"
          onClick={() => eventController(COMMANDS.DELETE_ALL)}>
          <Icon name="trash" className="object-scale-down" width={20} height={20} />
          <Text>
            <Trans>Delete all images</Trans>
          </Text>
        </Button>

        <Button
          id={COMMANDS.UPDATE_PROMPT}
          className="w-full px-4 py-2 justify-start items-center flex flex-row gap-x-4"
          onClick={() => eventController(COMMANDS.UPDATE_PROMPT)}>
          <Icon name="setting" className="object-scale-down" width={20} height={20} />
          <Text>
            <Trans>Change generate prompt</Trans>
          </Text>
        </Button>
      </View>
    </BottomDrawer>
  );
}

export default AdditionalCommands;
