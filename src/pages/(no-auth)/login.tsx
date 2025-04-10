import { View, Text } from 'react-native';
import { NRouter } from '@/@types/router';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'login'>;

const LoginPage: React.FC<TProps> = ({ navigation }) => {
  return (
    <View>
      <Text>Login</Text>
    </View>
  );
};

export default LoginPage;
