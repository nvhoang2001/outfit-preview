import { SUPPORTS_AI_MODELS } from '@/constants/support-ai-models';
import AIModelKeyVault from '@/modules/Vault/AIModelKeyVault';
import GeminiImageGenerativeSerivce from '../GeminiService';
import BaseImageGenerateService from '../BaseService';
import { Config } from 'react-native-config';
import { ErrorWithCode } from '@/utils/ErrorWithCode';
import { ERROR_CODE } from '@/constants/error-code';

class ImageGenerateServiceFactory {
  keyVault: AIModelKeyVault;

  constructor() {
    this.keyVault = new AIModelKeyVault();
  }

  private getFallbackKeyOfModel(model: string): string {
    switch (model) {
      case SUPPORTS_AI_MODELS.GOOGLE_GEMINI:
        return Config.GEMINI_API_KEY!;

      default:
        throw new ErrorWithCode(ERROR_CODE.NOT_FOUND_AI_MODEL_KEY, 'No key stored for this model');
    }
  }

  async createServiceModel(model: string): Promise<BaseImageGenerateService> {
    const fallbackKey = this.getFallbackKeyOfModel(SUPPORTS_AI_MODELS.GOOGLE_GEMINI);

    switch (model) {
      case SUPPORTS_AI_MODELS.GOOGLE_GEMINI: {
        let modelAPIKey!: string;

        try {
          modelAPIKey = await this.keyVault.getKeyName(SUPPORTS_AI_MODELS.GOOGLE_GEMINI);
        } catch (error) {
          const typedError = error as ErrorWithCode;

          if (typedError.code === ERROR_CODE.NOT_FOUND_AI_MODEL_KEY) {
            modelAPIKey = fallbackKey;
          } else {
            throw error;
          }
        }

        return new GeminiImageGenerativeSerivce(modelAPIKey);
      }
      default:
        throw new Error('');
    }
  }
}

const imageGenerateServiceFactory = new ImageGenerateServiceFactory();

export default imageGenerateServiceFactory;
