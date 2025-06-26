import Compressor from "compressorjs";

export const handleImage = async (file: File, callback: any) => {
  const reader = (readFile: File) =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsDataURL(readFile);
    });

  new Compressor(file, {
    quality: 0.8,
    maxWidth: 500,
    maxHeight: 500,
    resize: "contain",
    async success() {
      await reader(file).then((result) => {
        callback({ name: file?.name, url: result });
      });
    },
    error(error: Error) {
      console.error("Error reading file:", error);
    },
  });
};

export const testImageUrl = async (url: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true); // URL is valid and image loaded
    img.onerror = () => resolve(false); // URL is invalid or image failed to load
    img.src = url;
  });
};
