export namespace NImageService {
  export type TGeneratedResult = TImageGenerateResponse;
  export type TGeneratedImageResult = IGeneratedImageResult & { id: number };
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
