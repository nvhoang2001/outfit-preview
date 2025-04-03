import { Stack } from "expo-router";
import { View, Text } from "react-native";

function NoAuthLayout() {
	return (
		<View className="flex w-full flex-grow flex-shrink basis-auto flex-col h-full justify-center items-center bg-white dark:bg-black">
			<Text className="text-black dark:text-white">Hello</Text>

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
