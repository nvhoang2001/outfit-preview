import { SUPPORTS_AI_MODELS } from '@/constants/support-ai-models';
import AIModelKeyVault from '@/modules/Vault/AIModelKeyVault';
import GeminiImageGenerativeSerivce from '../GeminiService';
import BaseImageGenerateService from '../BaseService';

class ImageGenerateServiceFactory {
  keyVault: AIModelKeyVault;

  constructor() {
    this.keyVault = new AIModelKeyVault();
  }

  async createServiceModal(model: string): Promise<BaseImageGenerateService> {
    switch (model) {
      case SUPPORTS_AI_MODELS.GOOGLE_GEMINI: {
        const modelAPIKey = await this.keyVault.getKeyName(SUPPORTS_AI_MODELS.GOOGLE_GEMINI);

        return new GeminiImageGenerativeSerivce(modelAPIKey);
      }
      default:
        throw new Error('');
    }
  }
}

const imageGenerateServiceFactory = new ImageGenerateServiceFactory();

export default imageGenerateServiceFactory;
