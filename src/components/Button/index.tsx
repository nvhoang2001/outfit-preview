import { type GestureResponderEvent, Pressable } from 'react-native';

interface IProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
  onClick?: (ev: GestureResponderEvent) => void;
}

function Button({ id, children, onClick, className, disabled }: IProps) {
  return (
    <Pressable
      id={id}
      className={'rounded-lg text-white '.concat(className ?? '')}
      disabled={disabled}
      onPress={onClick}>
      {children}
    </Pressable>
  );
}

export default Button;
