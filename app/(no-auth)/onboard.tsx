import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import { t } from "@lingui/core/macro";

function OnboardPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	console.log("Onboard screen rendered");

	return (
		<View className="bg-white dark:bg-black h-11 justify-center px-6 flex-grow shrink basis-auto w-full">
			<Text className="text-black dark:text-white text-center text-xl mb-2">
				<Trans>Or</Trans>
			</Text>

			<View className="space-y-4">
				<TextInput
					className="bg-[#222222] text-white py-3 px-4 rounded-md"
					placeholder={t`Email address`}
					placeholderTextColor="#777"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
				/>

				<TextInput
					className="bg-[#222222] text-white py-3 px-4 rounded-md"
					placeholder={t`Password`}
					placeholderTextColor="#777"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
			</View>

			<TouchableOpacity>
				<Text className="text-white text-right mt-2">
					<Trans>Forgot Password?</Trans>
				</Text>
			</TouchableOpacity>

			<TouchableOpacity className="bg-[#00E676] py-3 rounded-md mt-6">
				<Text className="text-center text-black font-semibold">
					<Trans>Log In</Trans>
				</Text>
			</TouchableOpacity>
		</View>
	);
}

export default OnboardPage;
