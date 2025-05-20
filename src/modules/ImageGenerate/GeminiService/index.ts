import { NImageService } from '@/@types/image-service';
import BaseImageGenerate from '../BaseService';
import { GenerateContentParameters, GoogleGenAI, type Part } from '@google/genai';
import type { Asset } from 'react-native-image-picker';
import * as fs from '@dr.pogodin/react-native-fs';
import { getFileExtensionFromMimeType, getPictureDirPath } from '@/utils/assetsPathUtils';

type TGeneratedImage = Exclude<NImageService.TGeneratedResult, { type: 'text' }>;

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
          data: await fs.readFile(userImage.uri as string),
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
          data: await fs.readFile(outfitImage.uri as string),
        },
      };
    }
  }

  async generateImage(name: string): Promise<NImageService.TGeneratedResult[]> {
    if (!this.userImage || !this.outfitImage) {
      throw new Error(`Empty image selection`);
    }

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
          temperature: this.baseConfig.config!.temperature ?? 0 + i * 0.05,
        },
      });
    }

    const requestsResults = await Promise.allSettled(
      promptsConfigs.map(config => this.instance.models.generateContent(config))
    );

    const assetDirPath = getPictureDirPath();

    const hasCreatedAssetDir = await fs.exists(assetDirPath);
    let isCreatedAssetsDir = true;
    if (!hasCreatedAssetDir) {
      try {
        await fs.mkdir(assetDirPath, {
          NSURLIsExcludedFromBackupKey: true,
        });
        isCreatedAssetsDir = true;
      } catch (error) {
        console.log('Error: ', error);

        isCreatedAssetsDir = false;
      }
    }

    const tempFolderPath = `${assetDirPath}/tmp-${name}`;

    if (isCreatedAssetsDir) {
      try {
        await fs.mkdir(tempFolderPath, {
          NSURLIsExcludedFromBackupKey: true,
        });
        isCreatedAssetsDir = true;
      } catch (error) {
        console.log('Error: ', error);
        isCreatedAssetsDir = false;
      }
    }

    const results: NImageService.TGeneratedResult[] = [];
    let id = 0;

    for (const requestResult of requestsResults) {
      if (requestResult.status === 'fulfilled') {
        for (const candidate of requestResult.value.candidates || []) {
          for (const part of candidate.content?.parts || []) {
            const type = part.text ? 'text' : 'image';

            if (type === 'text') {
              continue;
            }

            const mimeType = part.inlineData?.mimeType || 'image/png';
            const data = part.inlineData!.data as string;

            results.push({
              id: id++,
              type,
              data: { content: `data:${mimeType};base64,${data}`, mimeType },
            });
          }
        }
      }
    }

    if (isCreatedAssetsDir) {
      const images = results.filter(image => image.type === 'image');

      const fileCreationData = images.map(image => {
        const fileExtension = getFileExtensionFromMimeType(image.data.mimeType);
        const fileName = `outfit-try-on-${image.id}`;
        const filepath = `${tempFolderPath}/${fileName}.${fileExtension}`;
        const data = image.data.content.slice(
          image.data.content.indexOf('base64,') + 'base64,'.length
        );

        return {
          filepath,
          data,
          encoding: 'base64' as const,
        };
      });

      const storeResults = await Promise.allSettled(
        fileCreationData.map(fileData =>
          fs.writeFile(fileData.filepath, fileData.data, fileData.encoding)
        )
      );

      for (let i = 0; i < storeResults.length; i++) {
        const result = storeResults[i];

        if (result.status === 'fulfilled') {
          const successImage = images[i];
          const itemIndex = successImage.id;

          (results[itemIndex] as TGeneratedImage).data.content =
            'file://' + fileCreationData[i].filepath;
        }
      }
    }

    return results;
  }

  changeConfig(key: string, value: unknown): void {
    if (key === 'prompt') {
      this.prompt = value as string;
    }
  }
  getConfig(key: string): unknown {
    if (key === 'prompt') {
      return this.prompt;
    }

    return null;
  }
}

export default GeminiImageGenerativeSerivce;
