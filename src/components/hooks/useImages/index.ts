import { useState, useEffect } from "react";

type Images = {
  imageUrl: string;
  width: number;
  height: number;
  loaded: boolean;
};

export const useImages = () => {
  const publicUrl = process.env.PUBLIC_URL;
  const [images, setImages] = useState<Images[]>([
    {
      imageUrl: `${publicUrl}/images/sky_00.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_01.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_02.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_03.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_04.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_05.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_06.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_07.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_08.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_09.jpg`,
      width: 0,
      height: 0,
      loaded: false,
    },
  ]);

  useEffect(() => {
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.imageUrl;
      img.onload = () => {
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index].width = img.width;
          updatedImages[index].height = img.height;
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
