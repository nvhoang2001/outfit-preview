import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from '@/components/Icons';
import useAuthStore from '@/store/auth.slice';

interface IProps {
  username: string;
  onSubmit: (password: string) => void;
  onSignInWithBiometric: () => void;
}

const styles = StyleSheet.create({
  inputError: {
    borderColor: 'red',
  },
});

function LoginForm({ username, onSubmit, onSignInWithBiometric }: IProps) {
  const canUseBiometric = useAuthStore(state => state.canUseBiometric);

  const { _: t } = useLingui();

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function passwordChangeHandler(text: string) {
    setPassword(text);
    setPasswordError('');
  }

  function signInWithBiometric() {
    onSignInWithBiometric();
  }

  function signInWithPassword() {
    if (!password) {
      setPasswordError(t(msg`Password is required`));
      return;
    }

    onSubmit(password);
  }

  return (
    <View>
      <View>
        <Text>
          <Trans>Welcome back, {username}</Trans>
        </Text>
      </View>

      <View className="flex flex-row gap-x-5">
        <View className="relative flex-1">
          <TextInput
            className="border border-gray-800 text-black dark:border-gray-50 dark:text-white py-3 pl-4 pr-14 rounded-md"
            placeholder={t(msg`Password`)}
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
        {canUseBiometric && (
          <TouchableOpacity
            className="bg-cyan-400 py-3 rounded-md mt-6"
            onPress={signInWithBiometric}>
            <Icon name="fingerprint" width={24} height={24} color="#777" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity className="bg-cyan-400 py-3 rounded-md mt-6" onPress={signInWithPassword}>
        <Trans>Login</Trans>
      </TouchableOpacity>
    </View>
  );
}

export default LoginForm;
