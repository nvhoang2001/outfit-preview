import { EConfigKeys } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import encHex from "crypto-js/enc-hex";
import { lib, AES as aes256, SHA256 as sha256 } from "crypto-js";
import { t } from "@lingui/core/macro";

export class PasswordAuthentication {
	private encryptionIV = "b0b788dfbb144d9022c75374e6d9a92a";

	private async getEncryptedPassword() {
		const encryptedPassword = await AsyncStorage.getItem(EConfigKeys.ENCRYPTED_PASSWORD);

		return encryptedPassword || "";
	}

	private async hashPassword(password: string) {
		return sha256(password).toString(encHex);
	}

	private getAuthEncryptData() {
		return new Promise<lib.WordArray>((resolve, reject) => {
			try {
				const key = lib.WordArray.random(256);

				resolve(key);
			} catch (error) {
				reject(error);
			}
		});
	}

	async saveCredentials(username: string, password: string) {
		const iv = this.encryptionIV;
		const encryptKey = await this.hashPassword(password);
		const data = await this.getAuthEncryptData();

		// Combine encrypted data and auth tag
		const result = aes256
			.encrypt(data, encryptKey, {
				iv: lib.WordArray.create(Buffer.from(iv, "hex")),
			})
			.toString();

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
				throw new Error(t`No encrypted password found`);
			}

			const encryptKey = await this.hashPassword(password);

			aes256.decrypt(encryptedPassword, encryptKey, {
				iv: lib.WordArray.create(Buffer.from(iv, "hex")),
			});

			return true;
		} catch (error) {
			throw new Error(t`Unknown error. Please try again later.`);
		}
	}
}

export default PasswordAuthentication;
