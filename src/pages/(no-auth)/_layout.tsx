import { View } from 'react-native';

function NoAuthLayout({ children }: { children: React.ReactNode }) {
  return <View className="w-full h-full bg-white dark:bg-black">{children}</View>;
}

export default NoAuthLayout;
