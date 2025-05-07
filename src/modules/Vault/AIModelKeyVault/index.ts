import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aes from 'react-native-aes-crypto';
import BaseAuthentication from '@/modules/Auth/LocalAuth/BaseAuthentication';

class AIModelKeyVault {
  static instance: AIModelKeyVault | undefined = undefined;

  constructor() {
    if (AIModelKeyVault.instance) {
      return AIModelKeyVault.instance;
    }

    AIModelKeyVault.instance = this;
  }

  async saveKeyWithName(name: string, key: string) {
    const hashKey = BaseAuthentication.hashedPassword;

    if (!hashKey) {
      throw new Error('');
    }

    const encryptedKey = await Aes.encrypt(
      key,
      hashKey,
      BaseAuthentication.encryptionIV,
      BaseAuthentication.encryptionAlgorithm
    );

    await AsyncStorage.setItem(`model_key_${name}`, encryptedKey);
  }

  async getKeyName(key: string) {
    const encryptedKeyValue = await AsyncStorage.getItem(`model_key_${key}`);

    if (!encryptedKeyValue) {
      throw new Error(i18n._(msg`Not found encrypted key`));
    }

    const hashKey = BaseAuthentication.hashedPassword;

    if (!hashKey) {
      throw new Error(i18n._(msg`Provide password to get the key`));
    }

    try {
      const storedKeyValue = await Aes.decrypt(
        encryptedKeyValue,
        hashKey,
        BaseAuthentication.encryptionIV,
        BaseAuthentication.encryptionAlgorithm
      );

      return storedKeyValue;
    } catch (error) {
      const typedError = error as Error & { code?: string };
      const isInvalidPassword = typedError.code === '-1';

      if (isInvalidPassword) {
        throw new Error(i18n._(msg`Invalid password. Please try another one.`));
      }

      throw new Error(i18n._(msg`Unknown error occurred. Please try again later.`));
    }
  }
}

export default AIModelKeyVault;
