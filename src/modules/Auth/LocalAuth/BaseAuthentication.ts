import Aes from 'react-native-aes-crypto';

class BaseAuthentication {
  static encryptionIV = 'b0b788dfbb144d9022c75374e6d9a92a';
  static encryptionAlgorithm = 'aes-256-cbc' as const;
  static hashedPassword?: string;

  protected getAuthEncryptData() {
    return Aes.randomKey(256);
  }
}

export default BaseAuthentication;
