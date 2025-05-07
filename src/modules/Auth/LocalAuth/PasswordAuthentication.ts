import { EConfigKeys } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aes from 'react-native-aes-crypto';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';
import BaseAuthentication from './BaseAuthentication';

class PasswordAuthentication extends BaseAuthentication {
  private async getEncryptedPassword() {
    const encryptedPassword = await AsyncStorage.getItem(EConfigKeys.ENCRYPTED_PASSWORD);

    return encryptedPassword || '';
  }

  private hashPassword(password: string) {
    return Aes.sha256(password);
  }

  async saveCredentials(username: string, password: string) {
    const iv = BaseAuthentication.encryptionIV;
    const algorithm = BaseAuthentication.encryptionAlgorithm;
    const encryptKey = await this.hashPassword(password);
    const data = await this.getAuthEncryptData();

    // Combine encrypted data and auth tag
    const result = await Aes.encrypt(data, encryptKey, iv, algorithm);

    await AsyncStorage.multiSet([
      [EConfigKeys.ENCRYPTED_PASSWORD, result],
      [EConfigKeys.USERNAME, username],
    ]);
  }

  async clearCredentials() {
    await AsyncStorage.multiRemove([EConfigKeys.ENCRYPTED_PASSWORD, EConfigKeys.USERNAME]);
  }

  async signIn(password?: string) {
    if (!password) {
      throw new Error(i18n._(msg`Password is required to sign in.`));
    }

    try {
      const iv = BaseAuthentication.encryptionIV;
      const encryptedPassword = await this.getEncryptedPassword();

      if (!encryptedPassword) {
        throw new Error(i18n._(msg`No password found`));
      }

      const encryptKey = await this.hashPassword(password);
      const algorithm = BaseAuthentication.encryptionAlgorithm;

      await Aes.decrypt(encryptedPassword, encryptKey, iv, algorithm);

      BaseAuthentication.hashedPassword = encryptKey;

      return password;
    } catch (error) {
      console.log('Error', error);

      const typedError = error as Error & { code?: string };
      const isInvalidPassword = typedError.code === '-1';

      if (isInvalidPassword) {
        throw new Error(i18n._(msg`Invalid password. Please try another one.`));
      }

      throw new Error(i18n._(msg`Unknown error occurred. Please try again later.`));
    }
  }
}

export default PasswordAuthentication;
