import * as Keychain from "react-native-keychain";
import { PasswordAuthentication } from "./PasswordAuthentication";
import { t } from "@lingui/core/macro";

class BiometricAuthentication extends PasswordAuthentication {
	static async isBiometricAvailable(biometryType?: Keychain.BIOMETRY_TYPE) {
		try {
			const supportedBiometryTypes = await Keychain?.getSupportedBiometryType();

			if (biometryType) {
				return biometryType === supportedBiometryTypes;
			}

			return Boolean(supportedBiometryTypes);
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	async saveCredentials(username: string, password: string) {
		try {
			await super.saveCredentials(username, password);

			await Keychain.setGenericPassword(username, password, {
				accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
				accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
			});
		} catch (error) {
			const typedError = error as Error;

			if (typedError.name === "BiometryEnrollmentCancel") {
				throw new Error(t`Biometric canceled by the user.`);
			}
		}
	}

	async signIn() {
		try {
			const credentials = await Keychain.getGenericPassword({
				accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY,
			});

			if (!credentials) {
				throw new Error(t`Biometric authentication failed.`);
			}

			const { password } = credentials;

			return super.signIn(password);
		} catch (error) {
			const typedError = error as Error;

			if (typedError.message.includes("authentication failed")) {
				throw new Error(t`Biometric authentication failed.`);
			}

			throw new Error(t`Unknown error. Please try again later.`);
		}
	}
}

export default BiometricAuthentication;
