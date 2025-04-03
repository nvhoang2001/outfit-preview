import { Stack } from "expo-router";

function AuthLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="homepage" />
		</Stack>
	);
}

export default AuthLayout;
