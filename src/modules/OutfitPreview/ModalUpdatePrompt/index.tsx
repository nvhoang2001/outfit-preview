import Button from '@/components/Button';
import useModal from '@/hooks/useModal';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

interface IProps {
  savedPrompt: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (prompt: string) => void;
  onRestorePrompt: () => void;
}

function ModalUpdatePrompt({ savedPrompt, isOpen, onClose, onConfirm, onRestorePrompt }: IProps) {
  const confirmUpdateModal = useModal();

  const [prompt, setPrompt] = useState('');

  function closeModal() {
    onClose();
    setPrompt('');
    confirmUpdateModal.closeModal();
  }

  function confirmUpdatePrompt() {
    onConfirm(prompt);
    closeModal();
  }

  function restoreToOriginalPrompt() {
    onRestorePrompt();
    closeModal();
  }

  useEffect(() => {
    if (isOpen) {
      setPrompt(savedPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal animationType="fade" transparent visible={isOpen} onRequestClose={closeModal}>
      <View className="relative flex flex-col justify-center items-center bg-black/50 flex-auto">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="px-10 w-full">
            <View className="px-6 py-4 flex flex-col gap-y-3 rounded-md bg-white dark:bg-gray-700 w-full">
              <Text className="text-dark dark:text-white text-xl text-center mb-4">
                <Trans>Image generation prompt</Trans>
              </Text>

              <View className="bg-yellow-200 px-4 py-2 rounded">
                <Text className="text-base text-dark dark:text-white">
                  <Trans>
                    <Text className="font-bold text-current">Warning: </Text> If you change the
                    prompt, the generated results may not as expected
                  </Trans>
                </Text>
              </View>

              <View className="flex flex-col">
                <TextInput
                  className="text-dark dark:text-white w-full border border-solid border-gray-700 dark:border-white p-1 rounded"
                  multiline
                  numberOfLines={4}
                  placeholder="Generate a high-quality virtual try-on image showing the person wearing the clothing from the second image. Preserve all facial features, hairstyle, skin tone, body proportions, pose, and background."
                  value={prompt}
                  onChangeText={text => setPrompt(text)}
                />

                <Button className="self-end mt-1" onClick={restoreToOriginalPrompt}>
                  <Text className="text-dark dark:text-white">
                    <Trans>Restore prompt</Trans>
                  </Text>
                </Button>
              </View>

              <View className="flex flex-row justify-end items-center gap-x-5">
                <Button
                  onClick={closeModal}
                  className="text-dark dark:text-white px-4 py-2 border border-solid border-black dark:border-white rounded">
                  <Text>
                    <Trans>Cancel</Trans>
                  </Text>
                </Button>

                <Button
                  className="px-4 py-2 bg-blue-400 rounded"
                  onClick={confirmUpdateModal.openModal}>
                  <Text className="text-white">
                    <Trans>Confirm</Trans>
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {confirmUpdateModal.isOpen && (
          <View className="absolute top-0 left-0 w-full h-full bg-black/50 dark:bg-white/25 flex justify-center items-center px-10">
            <View className="px-6 py-4 flex flex-col gap-y-4 rounded-md bg-white dark:bg-gray-700 max-w-full">
              <Text className="text-lg font-bold text-center text-dark dark:text-white">
                <Trans>Prompt Update Confirmation</Trans>
              </Text>

              <View>
                <Text className="text-dark dark:text-white">
                  <Trans>Are you really want to update the generation prompt as below?</Trans>
                </Text>

                <Text className="text-dark dark:text-white">
                  <Trans>
                    Please aware that, if you change the prompt, the generated results might be
                    different with your expectation!
                  </Trans>
                </Text>
              </View>
              <Text className="bg-yellow-200 py-2 px-4 text-dark dark:text-white">{prompt}</Text>

              <View className="flex flex-row justify-end gap-5">
                <Button
                  className="px-5 py-2 border border-solid border-black dark:border-white text-dark dark:text-white"
                  onClick={confirmUpdateModal.closeModal}>
                  <Text className="text-dark dark:text-white">
                    <Trans>No</Trans>
                  </Text>
                </Button>
                <Button
                  className="px-5 py-2 border border-solid border-blue-400 bg-blue-400"
                  onClick={confirmUpdatePrompt}>
                  <Text className="text-white">
                    <Trans>Yes</Trans>
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

export default ModalUpdatePrompt;
