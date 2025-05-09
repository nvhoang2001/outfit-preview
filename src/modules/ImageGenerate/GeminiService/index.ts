import { NImageService } from '@/@types/image-service';
import BaseImageGenerate from '../BaseService';
import { GenerateContentParameters, GoogleGenAI, type Part } from '@google/genai';
import type { Asset } from 'react-native-image-picker';
import { readFile } from '@dr.pogodin/react-native-fs';
import fakeData from './fake-data.json';

class GeminiImageGenerativeSerivce extends BaseImageGenerate {
  baseConfig: Omit<GenerateContentParameters, 'contents'> = {
    model: 'gemini-2.0-flash-exp-image-generation',
    config: {
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
      responseModalities: ['TEXT', 'IMAGE'],
      temperature: 0.4,
    },
  };
  prompt: string =
    'Generate a high-quality virtual try-on image showing the person wearing the clothing from the second image. Preserve all facial features, hairstyle, skin tone, body proportions, pose, and background.';
  instance: GoogleGenAI;
  userImage?: Part;
  outfitImage?: Part;

  constructor(key: string) {
    super(key);

    this.instance = new GoogleGenAI({
      apiKey: this.key,
    });
  }

  async initData(userImage: Asset, outfitImage: Asset) {
    if (userImage.base64) {
      this.userImage = {
        inlineData: {
          mimeType: userImage.type,
          data: userImage.base64,
        },
      };
    } else {
      this.userImage = {
        inlineData: {
          mimeType: userImage.type,
          data: await readFile(userImage.uri as string),
        },
      };
    }

    if (outfitImage.base64) {
      this.outfitImage = {
        inlineData: {
          mimeType: outfitImage.type,
          data: outfitImage.base64,
        },
      };
    } else {
      this.outfitImage = {
        inlineData: {
          mimeType: outfitImage.type,
          data: await readFile(outfitImage.uri as string),
        },
      };
    }
  }

  async generateImage(): Promise<NImageService.TGeneratedResult[]> {
    if (!this.userImage || !this.outfitImage) {
      throw new Error(`Empty image selection`);
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return fakeData.map((item, i) => ({ ...item, id: i }) as NImageService.TGeneratedResult);

    const promptsConfigs: GenerateContentParameters[] = [];

    for (let i = 0; i < 10; i++) {
      promptsConfigs.push({
        contents: [
          {
            text: this.prompt,
          },
          this.userImage,
          this.outfitImage,
        ],
        model: this.baseConfig.model,
        config: {
          ...this.baseConfig.config,
          temperature: this.baseConfig.config?.temperature ?? 0 + i * 0.1,
        },
      });
    }

    const requestsResults = await Promise.allSettled(
      promptsConfigs.map(config => this.instance.models.generateContent(config))
    );

    const results: NImageService.TGeneratedResult[] = [];

    for (const requestResult of requestsResults) {
      if (requestResult.status === 'fulfilled') {
        for (const candidate of requestResult.value.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            const type = part.text ? 'text' : 'image';

            if (type === 'text') {
              results.push({
                type,
                data: part.text as string,
              });

              continue;
            }

            const mimeType = part.inlineData?.mimeType || 'image/png';
            const data = part.inlineData!.data as string;

            results.push({
              type,
              data: { content: data, mimeType },
            });
          }
        }
      }
    }

    return results;
  }
}

export default GeminiImageGenerativeSerivce;
