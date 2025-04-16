import { EConfigKeys } from '@/constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aes from 'react-native-aes-crypto';
import { msg } from '@lingui/core/macro';
import { i18n } from '@lingui/core';

export class PasswordAuthentication {
  private encryptionIV = 'b0b788dfbb144d9022c75374e6d9a92a';
  private encryptionAlgorithm = 'aes-256-cbc' as const;

  private async getEncryptedPassword() {
    const encryptedPassword = await AsyncStorage.getItem(EConfigKeys.ENCRYPTED_PASSWORD);

    return encryptedPassword || '';
  }

  private async hashPassword(password: string) {
    return await Aes.sha256(password);
  }

  private getAuthEncryptData() {
    return Aes.randomKey(256);
  }

  async saveCredentials(username: string, password: string) {
    const iv = this.encryptionIV;
    const algorithm = this.encryptionAlgorithm;
    const encryptKey = await this.hashPassword(password);
    const data = await this.getAuthEncryptData();

    // Combine encrypted data and auth tag
    const result = await Aes.encrypt(data, encryptKey, iv, algorithm);

    await AsyncStorage.multiSet([
      [EConfigKeys.ENCRYPTED_PASSWORD, result],
      [EConfigKeys.USERNAME, username],
    ]);
  }

  async signIn(password: string) {
    try {
      const iv = this.encryptionIV;
      const encryptedPassword = await this.getEncryptedPassword();

      if (!encryptedPassword) {
        throw new Error(i18n._(msg`No password found`));
      }

      const encryptKey = await this.hashPassword(password);
      const algorithm = this.encryptionAlgorithm;

      await Aes.decrypt(encryptedPassword, encryptKey, iv, algorithm);

      return true;
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

export default PasswordAuthentication;
