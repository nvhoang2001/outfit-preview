export namespace NImageService {
  export type TGeneratedResult = TImageGenerateResponse;
}

interface IGeneratedTextResult {
  type: 'text';
  data: string;
}

interface IGeneratedImageResult {
  type: 'image';
  data: {
    content: string;
    mimeType: string;
  };
}

type TImageGenerateResponse = (IGeneratedImageResult | IGeneratedTextResult) & { id: number };
