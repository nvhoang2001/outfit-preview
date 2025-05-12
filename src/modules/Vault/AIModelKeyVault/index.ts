import AsyncStorage from '@react-native-async-storage/async-storage';
import Aes from 'react-native-aes-crypto';
import BaseAuthentication from '@/modules/Auth/LocalAuth/BaseAuthentication';
import { ErrorWithCode } from '@/utils/ErrorWithCode';
import { ERROR_CODE } from '@/constants/error-code';

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
      throw new ErrorWithCode(ERROR_CODE.NOT_FOUND_AI_MODEL_KEY, 'No key stored for this model');
    }

    const hashKey = BaseAuthentication.hashedPassword;

    if (!hashKey) {
      throw new ErrorWithCode(ERROR_CODE.NO_AUTHENTICATION, 'User not login yet');
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
        throw new ErrorWithCode(ERROR_CODE.INVALID_PASSWORD, 'Invalid stored password');
      }

      throw new ErrorWithCode(
        ERROR_CODE.UNKNOW_ERROR,
        'Unknown error occurred. Please try again later.'
      );
    }
  }
}

export default AIModelKeyVault;
