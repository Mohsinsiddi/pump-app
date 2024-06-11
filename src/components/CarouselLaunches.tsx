"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import ImageRender from "./ImageRender";
import ImageRenderCurousel from "./ImageRenderCorousel";
import { Json } from "@/lib/database.types";
import { fetchToken, fetchTokenById } from "@/action/tokens";
import axios from "axios";
import {
  HighlightedTokenData,
  TokenDataType,
  TokenDataTypeWithTrades,
} from "@/types/db.types";
import { getWaitTimeData } from "@/util/getWaitTimeHighlights";
import useStore from "@/app/store/useStore";

type CarouselLaunchesType = {
  data: Data | Json | null;
};

interface Highlight {
  id: number;
  position: number;
  token_id: string;
  created_at: string;
  price_paid: number;
  slot_hours: number;
  start_time: string;
  creator_address: string;
  highlight_signature: string;
}

interface Data {
  [key: string]: Highlight[] | null;
}
export function CarouselLaunches({ data }: CarouselLaunchesType) {
  if (!data) {
    return <div></div>;
  }

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const imageUrl = [
    "https://image.binance.vision/editor-uploads-original/9c15d9647b9643dfbc5e522299d13593.png",
    "https://boredapeyachtclub.com/_next/image?url=%2Fimages%2Ftransitions%2Fbayc%2F2.webp&w=1200&q=75",
    "https://gateway.pinata.cloud/ipfs/QmQfZi6k8Wd6n6GvEq2WbnZZ6EJxUjzMsoWgxYpokxNFkX",
  ];
  const image = imageUrl[0];
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs sm:max-w-lg md:max-w-4xl mt-[-36px]"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="">
        {Object.keys(data!).map((key: string) => {
          if (!data[key as keyof Json]) {
            const name = "Mohsin Dev is OP";
            const symbol = "MOHSIN";
            const description =
              " I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.";
            const owner = "FKQ1nEazoN9SiEy5xRC4FrskjT3B3usdB74sC9sUYq7";
            const favouritePorjectData: HighlightedTokenData = {
              create_signature: "",
              created_at: "",
              description: description,
              id: "",
              image: "",
              metadata_uri: "",
              name: name,
              owner: owner,
              symbol: symbol,
              views: 0,
              lpMatured: false,
              trade_count: 0,
              wishlist_count: 0,
            };
            return (
              <CarouselItem key={key} className="">
                <div className="">
                  <Card>
                    <CardContent className="flex aspect-[4/3] md:aspect-[16/9] items-center justify-center bg-black p-1">
                      <ImageRenderCurousel
                        imageUrl={image}
                        callBackImageUrl=""
                        data={favouritePorjectData}
                        position={key.split("_")[1]}
                        ends_in={0}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          }
          const [token_data, setTokenData] =
            React.useState<HighlightedTokenData | null>(null);
          React.useEffect(() => {
            async function fetchData() {
              if (data) {
                const render_data: any = data[key as keyof Json];
                console.log(render_data);
                const tokenId = render_data[0].token_id;
                const token_data = await axios.get(
                  `/api/fetch-token-by-id/${tokenId}`
                );
                setTokenData(token_data.data);
              }
            }
            fetchData();
          }, []);

          if (!token_data) {
            const name = "Mohsin Dev is OP";
            const symbol = "MOHSIN";
            const description =
              " I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.  I love kittens very much. They are amazing.";
            const owner = "FKQ1nEazoN9SiEy5xRC4FrskjT3B3usdB74sC9sUYq7";
            const favouritePorjectData: HighlightedTokenData = {
              create_signature: "",
              created_at: "",
              description: description,
              id: "",
              image: "",
              metadata_uri: "",
              name: name,
              owner: owner,
              symbol: symbol,
              views: 0,
              lpMatured: false,
              trade_count: 0,
              wishlist_count: 0,
            };

            return (
              <CarouselItem key={key} className="">
                <div className="">
                  <Card>
                    <CardContent className="flex aspect-[4/3] md:aspect-[16/9] items-center justify-center bg-black p-1">
                      <ImageRenderCurousel
                        imageUrl={image}
                        callBackImageUrl=""
                        data={favouritePorjectData}
                        position={key.split("_")[1]}
                        ends_in={0}
                      />
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          }

          const render_data: any = data[key as keyof Json];

          const ends_in =
            new Date(render_data[0].start_time).getTime() +
            render_data[0].slot_hours * 60 * 60 * 1000;

          return (
            <CarouselItem key={token_data?.id} className="">
              <div className="">
                <Card>
                  <CardContent className="flex aspect-[4/3] md:aspect-[16/9] items-center justify-center bg-black p-1">
                    <ImageRenderCurousel
                      imageUrl={token_data?.image}
                      callBackImageUrl=""
                      data={token_data}
                      position={key.split("_")[1]}
                      ends_in={ends_in}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="bg-black" />
      <CarouselNext className="bg-black" />
    </Carousel>
  );
}
