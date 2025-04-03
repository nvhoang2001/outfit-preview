import { EConfigKeys } from "@/constants/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function retrieveUserInfo() {
	const username = await AsyncStorage.getItem(EConfigKeys.USERNAME);

	if (!username) {
		return undefined;
	}

	return {
		username,
	};
}
