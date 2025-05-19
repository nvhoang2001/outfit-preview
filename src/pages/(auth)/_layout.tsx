import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface IProps {
  children: React.ReactNode;
}

function AuthLayout({ children }: IProps) {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default AuthLayout;
