import { type GestureResponderEvent, Pressable } from 'react-native';

interface IProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: GestureResponderEvent) => void;
}

function Button({ children, onClick, className, disabled }: IProps) {
  return (
    <Pressable
      className={'rounded-lg text-white '.concat(className ?? '')}
      disabled={disabled}
      onPress={onClick}>
      {children}
    </Pressable>
  );
}

export default Button;
