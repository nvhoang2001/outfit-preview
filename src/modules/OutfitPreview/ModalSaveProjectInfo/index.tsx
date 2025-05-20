import Button from '@/components/Button';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';
import { Keyboard, Modal, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

function ModalSaveProjectInfo({ isOpen, onClose, onSave }: IProps) {
  const [projectName, setProjectName] = useState('');

  function closeModal() {
    onClose();
  }

  return (
    <Modal animationType="fade" transparent visible={isOpen} onRequestClose={closeModal}>
      <View className="relative flex flex-col justify-center items-center bg-black/50 flex-auto">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="px-10 w-full">
            <View className="px-6 py-4 flex flex-col rounded-md bg-white dark:bg-neutral-900 w-full">
              <Text className="text-dark dark:text-white text-xl text-center mb-4">
                <Trans>Project name</Trans>
              </Text>

              <TextInput
                className="w-full text-dark dark:text-white border border-solid border-gray-700 dark:border-white px-2 py-1.5 rounded mb-4"
                multiline
                numberOfLines={4}
                placeholder="Type project name"
                value={projectName}
                onChangeText={text => setProjectName(text)}
              />

              <View className="flex flex-row justify-end items-center gap-x-5">
                <Button
                  onClick={closeModal}
                  className="text-dark dark:text-white px-4 py-2 border border-solid border-black dark:border-white rounded">
                  <Text className="text-dark dark:text-white">
                    <Trans>Cancel</Trans>
                  </Text>
                </Button>

                <Button
                  className="px-4 py-2 bg-blue-400 rounded"
                  onClick={() => onSave(projectName)}>
                  <Text className="text-white">
                    <Trans>Confirm</Trans>
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}

export default ModalSaveProjectInfo;
