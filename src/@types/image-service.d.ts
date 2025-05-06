export namespace NImageService {
  export type TGeneratedResult = TImageGenerateResponse;
}

interface IGeneratedTextResult {
  type: 'text';
  data: string;
}

interface IGeneratedImageResult {
  type: 'image';
  data: Blob;
}

type TImageGenerateResponse = IGeneratedImageResult | IGeneratedTextResult;
