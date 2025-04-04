import { Stack } from "expo-router";
import { View, Text } from "react-native";

function NoAuthLayout() {
	return (
		<View className="w-full h-full bg-white dark:bg-black">
			<Stack
				screenOptions={{
					headerShown: false,
				}}>
				<Stack.Screen name="login" />
				<Stack.Screen name="onboard" />
			</Stack>
		</View>
	);
}

export default NoAuthLayout;
