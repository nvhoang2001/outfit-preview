import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';
import Icon from '@/components/Icons';

interface IProps {
  onSubmit: (username: string, password: string) => void;
}

const styles = StyleSheet.create({
  inputError: {
    borderColor: 'red',
  },
});

function OnboardForm({ onSubmit }: IProps) {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function usernameChangeHandler(text: string) {
    setUsername(text);
    setUsernameError('');
  }

  function passwordChangeHandler(text: string) {
    setPassword(text);
    setPasswordError('');
  }

  function validateUsername(text: string) {
    if (!text.trim()) {
      setUsernameError(t`Username is required.`);
      return false;
    }

    if (text.length < 3) {
      setUsernameError(t`Username must be at least 3 characters long.`);
      return false;
    }

    return true;
  }

  function validatePassword(text: string) {
    if (!text.trim()) {
      setPasswordError(t`Password is required.`);
      return false;
    }

    if (text.length < 8) {
      setPasswordError(t`Password must be at least 8 characters long.`);
      return false;
    }

    return true;
  }

  function saveNewUserInfo() {
    if (!validateUsername(username) || !validatePassword(password)) {
      return;
    }

    onSubmit(username, password);
  }

  return (
    <View className="flex flex-col gap-y-5">
      <View>
        <TextInput
          className="border border-gray-800 text-black dark:border-gray-50 dark:text-white py-3 px-4 rounded-md"
          placeholder={t`Username`}
          style={usernameError ? styles.inputError : {}}
          placeholderTextColor="#777"
          numberOfLines={1}
          value={username}
          onChangeText={usernameChangeHandler}
        />
        {usernameError && <Text className="text-red-500 text-sm">{usernameError}</Text>}
      </View>

      <View className="relative">
        <TextInput
          className="border border-gray-800 text-black dark:border-gray-50 dark:text-white py-3 pl-4 pr-14 rounded-md"
          placeholder={t`Password`}
          placeholderTextColor="#777"
          style={passwordError ? styles.inputError : {}}
          value={password}
          numberOfLines={1}
          textContentType="password"
          onChangeText={passwordChangeHandler}
          secureTextEntry={!showPassword}
        />

        <TouchableOpacity
          className="absolute right-4 top-0 bottom-0 justify-center"
          onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye' : 'eyeFold'} width={24} height={24} color="#777" />
        </TouchableOpacity>
        {passwordError && <Text className="text-red-500 text-sm">{passwordError}</Text>}
      </View>

      <TouchableOpacity className="bg-cyan-400 py-3 rounded-md mt-6" onPress={saveNewUserInfo}>
        <Text className="text-center text-black font-semibold">
          <Trans>Explore Now</Trans>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default OnboardForm;
