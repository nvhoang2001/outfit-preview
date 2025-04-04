import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Trans } from "@lingui/react/macro";
import CameraIcon from "@/assets/images/icons/camera.svg";
import { t } from "@lingui/core/macro";

function OnboardPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<View className="h-full bg-white dark:bg-slate-800 justify-center px-6 flex-grow shrink basis-auto w-full">
			<View className="w-full flex items-center">
				<CameraIcon width={80} height={80} />
			</View>

			<View className="flex flex-col gap-y-5">
				<TextInput
					className="border border-gray-800 text-black dark:text-white py-3 px-4 rounded-md"
					placeholder={t`Username`}
					placeholderTextColor="#777"
					value={username}
					onChangeText={setUsername}
				/>

				<TextInput
					className="border border-gray-800 text-black dark:text-white py-3 px-4 rounded-md"
					placeholder={t`Password`}
					placeholderTextColor="#777"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
				/>
			</View>

			<TouchableOpacity className="bg-cyan-400 py-3 rounded-md mt-6">
				<Text className="text-center text-black font-semibold">
					<Trans>Log In</Trans>
				</Text>
			</TouchableOpacity>
		</View>
	);
}

export default OnboardPage;
