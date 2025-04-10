import { NRouter } from '@/@types/router';
import StartScreen from '@/pages';
import AuthLayout from '@/pages/(auth)/_layout';
import Homepage from '@/pages/(auth)/homepage';
import NoAuthLayout from '@/pages/(no-auth)/_layout';
import LoginPage from '@/pages/(no-auth)/login';
import OnboardPage from '@/pages/(no-auth)/onboard';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<NRouter.TRootStackParamList>();

function AppRouter() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="index">
        <Stack.Screen name="index" component={StartScreen} />
        <Stack.Group screenLayout={AuthLayout}>
          <Stack.Screen name="homepage" component={Homepage} />
        </Stack.Group>
        <Stack.Group screenLayout={NoAuthLayout}>
          <Stack.Screen name="login" component={LoginPage} />
          <Stack.Screen name="onboard" component={OnboardPage} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRouter;
