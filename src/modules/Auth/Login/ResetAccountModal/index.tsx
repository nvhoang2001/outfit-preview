import I18nProvider from '@/modules/Localization/I18nProvider';
import { Trans } from '@lingui/react/macro';
import { Modal, Pressable, Text, View } from 'react-native';

interface IProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ResetAccountModal({ onClose, onConfirm, visible }: IProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View className="flex flex-col justify-center items-center bg-black/50 px-10 dark:bg-white/25 flex-auto">
        <View className="rounded-3xl px-9 py-5 bg-white dark:bg-black">
          <Text className="text-center mb-3 font-bold text-xl">
            <Trans> Reset account? </Trans>
          </Text>

          <Text className="text-justify mb-4">
            <Trans>
              Warning: Reset account will remove all associated data of your account! Are you sure
              about that?
            </Trans>
          </Text>

          <View className="flex flex-col gap-5">
            <Pressable
              className="rounded-lg px-6 py-3 border border-solid border-black"
              onPress={onClose}>
              <Text>
                <Trans> No, let me try again </Trans>
              </Text>
            </Pressable>
            <Pressable
              className="rounded-lg px-6 py-3 border border-solid border-cyan-400 bg-cyan-400"
              onPress={onConfirm}>
              <Text className="text-white">
                <Trans> Yes, reset my account </Trans>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default ResetAccountModal;
