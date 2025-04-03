import { EConfigKeys } from "@/constants/config";
import { locales as supportedLocaleLangs } from "@/constants/locales";
import BiometricAuthentication from "@/modules/Auth/LocalAuth/BiometricAuthentication";
import useAuthStore from "@/store/auth.slice";
import useSettingStore from "@/store/setting.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import {
	Animated,
	Easing,
	NativeModules,
	Platform,
	useAnimatedValue,
	View,
	Settings,
	I18nManager,
} from "react-native";
import CameraIcon from "@/assets/images/icons/camera.svg";
import { useRouter } from "expo-router";
import { retrieveUserInfo } from "@/modules/Auth/LocalAuth/utils/retrieveUserInfo";

export default function StartScreen() {
	const isLoggedIn = useAuthStore((state) => state.isSignedIn);
	const userData = useAuthStore((state) => state.user);
	const updateBiometricAvailability = useAuthStore((state) => state.setCanUseBiometric);
	const updateUser = useAuthStore((state) => state.setUser);
	const updateActiveLocaleLang = useSettingStore((state) => state.setActiveLocaleLang);
	const currentLocale = useSettingStore((state) => state.localeLang);
	const scaleAnimateValue = useAnimatedValue(0);
	const router = useRouter();

	const isOnboarded = Boolean(userData);

	async function getUserInfo() {
		const userInfo = await retrieveUserInfo();

		if (userInfo) {
			updateUser(userInfo);
		}
	}

	async function checkBiometricAvailability() {
		const isAvailable = await BiometricAuthentication.isBiometricAvailable();
		updateBiometricAvailability(isAvailable);
	}

	async function checkActiveLocaleLang() {
		const activeLocaleLang = await AsyncStorage.getItem(EConfigKeys.ACTIVE_LANG);

		if (activeLocaleLang && activeLocaleLang !== currentLocale) {
			updateActiveLocaleLang(activeLocaleLang.toLowerCase());
		}

		let deviceLocaleLang = "en";

		if (Platform.OS === "ios") {
			const locale = Settings.get("AppleLocale") || Settings.get("AppleLanguages")[0];

			if (locale) {
				deviceLocaleLang = locale.toLowerCase();
			}
		} else {
			const locale = I18nManager.getConstants().localeIdentifier;

			if (locale) {
				deviceLocaleLang = locale.toLowerCase();
			}
		}

		if (
			!activeLocaleLang &&
			deviceLocaleLang !== currentLocale &&
			supportedLocaleLangs.includes(deviceLocaleLang as "en" | "vi")
		) {
			updateActiveLocaleLang(deviceLocaleLang);
		}
	}

	function onboardingAnimation() {
		Animated.timing(scaleAnimateValue, {
			toValue: 1,
			duration: 1000,
			easing: Easing.bounce,
			useNativeDriver: true,
		}).start();
	}

	async function initAppData() {
		const minLoad = new Promise((resolve) => setTimeout(resolve, 1000));
		const task = [
			checkBiometricAvailability(),
			checkActiveLocaleLang(),
			getUserInfo(),
			minLoad,
		];
		try {
			await Promise.all(task);

			if (isLoggedIn) {
				router.replace("/homepage");
			} else {
				if (isOnboarded) {
					router.replace("/login");
				} else {
					router.replace("/onboard");
				}
			}
		} catch (error) {
			console.log("Error: ", error);
		}
	}

	useEffect(() => {
		initAppData();
		onboardingAnimation();
	}, []);

	return (
		<View className="flex flex-col justify-center items-center h-full bg-white dark:bg-black">
			<Animated.View
				className="rounded-full border-2 border-black dark:border-white"
				style={{
					transform: [{ scale: scaleAnimateValue }],
				}}>
				<View className="p-10 rounded-full bg-black/20 dark:bg-white">
					<CameraIcon width={80} height={80} fill="currentColor" />
				</View>
			</Animated.View>
		</View>
	);
}
