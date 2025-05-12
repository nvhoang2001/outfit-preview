import CameraIcon from '@/assets/images/icons/camera.svg';
import EyeIcon from '@/assets/images/icons/eye.svg';
import EyeFoldIcon from '@/assets/images/icons/eye-fold.svg';
import FingerprintIcon from '@/assets/images/icons/fingerprint.svg';
import BarIcon from '@/assets/images/icons/bar.svg';
import SearchIcon from '@/assets/images/icons/search.svg';
import CameraShutterIcon from '@/assets/images/icons/camera-shutter.svg';
import ArrowBackIcon from '@/assets/images/icons/arrow-back.svg';
import ThreeDotsCircleIcon from '@/assets/images/icons/three-dots-circle.svg';
import SaveItemIcon from '@/assets/images/icons/save-item.svg';
import EmptyBoxIcon from '@/assets/images/icons/empty-box.svg';
import MergeIcon from '@/assets/images/icons/merge.svg';
import TrashIcon from '@/assets/images/icons/trash.svg';
import PlusIcon from '@/assets/images/icons/plus.svg';
import CloseIcon from '@/assets/images/icons/close.svg';
import TickIcon from '@/assets/images/icons/tick.svg';

import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: keyof typeof icons;
  width?: number;
  height?: number;
  color?: string;
}

const icons = {
  camera: CameraIcon,
  eye: EyeIcon,
  eyeFold: EyeFoldIcon,
  fingerprint: FingerprintIcon,
  bar: BarIcon,
  search: SearchIcon,
  'camera-shutter': CameraShutterIcon,
  'arrow-back': ArrowBackIcon,
  'three-dots-circle': ThreeDotsCircleIcon,
  'save-item': SaveItemIcon,
  'empty-box': EmptyBoxIcon,
  merge: MergeIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  close: CloseIcon,
  tick: TickIcon,
};

function Icon({ width, height, color, name, ...props }: IconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={width} height={height} color={color} {...props} />;
}

export default Icon;
