import CameraIcon from '@/assets/images/icons/camera.svg';
import EyeIcon from '@/assets/images/icons/eye.svg';
import EyeFoldIcon from '@/assets/images/icons/eye-fold.svg';
import FingerprintIcon from '@/assets/images/icons/fingerprint.svg';
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
};

function Icon({ width, height, color, name, ...props }: IconProps) {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent width={width} height={height} color={color} {...props} />;
}

export default Icon;
