export namespace NProject {
  export type ProjectItem = IProjectItem;
}

interface IProjectItem {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnailSrc: string;
  selectedImages: string[];
  resultImages: string[];
}
