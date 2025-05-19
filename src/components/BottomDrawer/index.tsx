import type { RefObject } from 'react';

import {
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import Backdrop from './Backdrop';

interface IProps extends BottomSheetModalProps {
  ref: RefObject<BottomSheetModal | null>;
  children: React.ReactNode;
}

function BottomDrawer({ ref, children, ...props }: IProps) {
  return (
    <BottomSheetModal ref={ref} backdropComponent={Backdrop} {...props}>
      <BottomSheetView>{children}</BottomSheetView>
    </BottomSheetModal>
  );
}

export default BottomDrawer;
