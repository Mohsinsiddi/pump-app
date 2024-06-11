"use client";

import Image from "next/image";
import React, { useState } from "react";

interface ImageRenderProps {
  imageUrl: string;
  callBackImageUrl: string;
}

const ImageRender: React.FC<ImageRenderProps> = ({
  imageUrl,
  callBackImageUrl,
}) => {
  const [imgSrc, setImgSrc] = useState(imageUrl);
  return (
    <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-56 xl:h-56">
      <Image
        alt="sol-nft-image"
        fill
        sizes="100%"
        src={imageUrl}
        className="object-cover rounded-md"
        onError={() => {
          setImgSrc(callBackImageUrl);
        }}
      />
    </div>
  );
};
export default ImageRender;
