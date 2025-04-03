import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import I18nProvider from "@/modules/Auth/Localization/I18nProvider";
import "@/styles/global.css";

export default function RootLayout() {
	return (
		<I18nProvider>
			<SafeAreaView className="h-full">
				<Stack
					screenOptions={{
						headerShown: false,
					}}>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(no-auth)" />
				</Stack>
			</SafeAreaView>
		</I18nProvider>
	);
}
