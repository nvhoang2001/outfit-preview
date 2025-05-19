import { NImageService } from '@/@types/image-service';
import { Asset } from 'react-native-image-picker';

abstract class BaseImageGenerateService {
  constructor(protected key: string) {}

  abstract initData(_userImage: Asset, _outfitImage: Asset): Promise<void>;
  abstract generateImage(): Promise<NImageService.TGeneratedResult[]>;
  changeConfig(_key: string, _value: unknown) {}
  getConfig(_key: string): unknown {
    return null as unknown;
  }
}

export default BaseImageGenerateService;
