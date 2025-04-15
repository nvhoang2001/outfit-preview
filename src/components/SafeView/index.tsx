/**
 * Fixed version of SafeAreaView for react-native-safe-area-context
 * https://github.com/AppAndFlow/react-native-safe-area-context/pull/610
 */
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export const SafeView = ({ children, style, className }: IProps) => {
  const insets = useSafeAreaInsets();

  const top = typeof insets.top === 'number' ? insets.top : 0;
  const bottom = typeof insets.bottom === 'number' ? insets.bottom : 0;
  const left = typeof insets.left === 'number' ? insets.left : 0;
  const right = typeof insets.right === 'number' ? insets.right : 0;

  return (
    <View
      className={className}
      style={[
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

export default SafeView;
