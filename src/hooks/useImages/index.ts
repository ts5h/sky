import { useEffect, useState } from "react";

type Images = {
  imageUrl: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  loaded: boolean;
};

export const useImages = () => {
  const publicUrl = process.env.PUBLIC_URL;
  const [images, setImages] = useState<Images[]>(() => {
    const initialImages: Images[] = [];
    for (let i = 0; i < 20; i++) {
      initialImages.push({
        imageUrl: `${publicUrl}/images/sky_${i
          .toString()
          .padStart(2, "0")}.jpg`,
        image: new Image(),
        width: 0,
        height: 0,
        loaded: false,
      });
    }
    return initialImages;
  });

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.imageUrl;
      img.onload = () => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index].image = img;
          updatedImages[index].width = img.naturalWidth;
          updatedImages[index].height = img.naturalHeight;
          updatedImages[index].loaded = true;
          return updatedImages;
        });
      };
      img.onerror = (e) => {
        console.error(e);
      };
    });
  }, []);

  return { images };
};
