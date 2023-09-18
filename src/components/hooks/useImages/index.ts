import { useState, useEffect } from "react";

type Images = {
  imageUrl: string;
  image: HTMLImageElement;
  width: number;
  height: number;
  loaded: boolean;
};

export const useImages = () => {
  const publicUrl = process.env.PUBLIC_URL;
  const [images, setImages] = useState<Images[]>([
    {
      imageUrl: `${publicUrl}/images/sky_00.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_01.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_02.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_03.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_04.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_05.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_06.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_07.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_08.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_09.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_10.jpg`,
      image: new Image(),
      width: 0,
      height: 0,
      loaded: false,
    },
    {
      imageUrl: `${publicUrl}/images/sky_11.jpg`,
      image: new Image(),
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
          updatedImages[index].image = img;
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
