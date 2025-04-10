import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NRouter } from '@/@types/router';

type TProps = NativeStackScreenProps<NRouter.TRootStackParamList, 'homepage'>;

const Homepage: React.FC<TProps> = ({ navigation }) => {
  return (
    <View>
      <Text>Homepage</Text>
    </View>
  );
};

export default Homepage;
