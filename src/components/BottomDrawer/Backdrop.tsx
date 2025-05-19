import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import { type GestureResponderEvent, Pressable, type PressableProps } from 'react-native';

type TProps = PressableProps;

function Backdrop(props: TProps) {
  const { dismiss: closeDrawer } = useBottomSheetModal();

  function backdropClickHandler(event: GestureResponderEvent) {
    props.onPress?.(event);

    closeDrawer();
  }

  return (
    <Pressable
      {...props}
      className="h-full flex-auto grow shrink bg-black/25"
      onPress={backdropClickHandler}
    />
  );
}

export default Backdrop;
