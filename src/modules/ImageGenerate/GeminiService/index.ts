import { NImageService } from '@/@types/image-service';
import BaseImageGenerate from '../BaseService';
import { GenerateContentParameters, GoogleGenAI, type Part } from '@google/genai';
import type { Asset } from 'react-native-image-picker';
import { readFile } from '@dr.pogodin/react-native-fs';
import { atob } from 'react-native-quick-base64';

class GeminiImageGenerativeSerivce extends BaseImageGenerate {
  baseConfig: Omit<GenerateContentParameters, 'contents'> = {
    model: 'gemini-2.0-flash-exp-image-generation',
    config: {
      topK: 32,
      topP: 1,
      maxOutputTokens: 2048,
      responseModalities: ['TEXT', 'IMAGE'],
      temperature: 0.4,
      candidateCount: 10,
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

  static getKey() {}

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

    const response = await this.instance.models.generateContent({
      ...this.baseConfig,
      contents: [
        {
          text: this.prompt,
        },
        this.userImage,
        this.outfitImage,
      ],
    });

    const results: NImageService.TGeneratedResult[] = [];

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        const type = part.text ? 'text' : 'image';

        if (type === 'text') {
          results.push({
            type,
            data: part.text as string,
          });

          continue;
        }

        const data = new Blob([atob(part.inlineData!.data as string)], {
          type: part.fileData!.mimeType || 'image/png',
          lastModified: Number(response.createTime),
        });

        results.push({
          type,
          data,
        });
      }
    }

    return results;
  }
}

export default GeminiImageGenerativeSerivce;
