export function getDisplayBlobImageLink(image: Blob) {
  const fileReader = new FileReader();

  fileReader.readAsDataURL(image);

  return new Promise<string>((success, failed) => {
    fileReader.onloadend = () => {
      if (fileReader.error) {
        failed(fileReader.error);
      }
      success(fileReader.result as string);
    };
  });
}
