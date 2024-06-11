"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bounded from "./Bounded";
import TokenCard from "./TokenCard";
import {
  ExploreTokenDataType,
  LPMaturedTokens,
  PopularTokenDataType,
  TokenDataTypeWithMostTrades,
  TokenDataTypeWithTrades,
} from "@/types/db.types";
import clsx from "clsx";
import { Database } from "@/lib/database.types";
import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PopularTokenCard from "./PopularTokensCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import LpMaturedTokenCard from "./LPMaturedTokenCard";

type MaintabType = {
  exploreData: ExploreTokenDataType[];
  popularData: PopularTokenDataType[];
  lpMaturedTokens: LPMaturedTokens[];
};

export function MainTab({
  exploreData,
  popularData,
  lpMaturedTokens,
}: MaintabType) {
  const supabase = createSupabaseClientSide();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime token creation")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tokens",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <Tabs defaultValue="explorer" className="">
      <TabsList
        className={clsx(
          "grid w-[300px] md:w-[640px] grid-cols-3 place-items-center",
          exploreData.length < 5 ? "" : ""
        )}
      >
        <TabsTrigger value="explorer" className="w-[100px] md:w-[200px]">
          Explorer
        </TabsTrigger>
        <TabsTrigger value="top_performer" className="w-[100px] md:w-[200px]">
          Top Tokens
        </TabsTrigger>
        <TabsTrigger value="lp_matured" className="w-[100px] md:w-[200px]">
          LP Matured
        </TabsTrigger>
      </TabsList>
      <div className="flex mt-1 gap-x-2">
        <Input
          className="shadow-inner bg-[#25294a] w-1/2"
          placeholder="Search Tokens..."
        />
        <Button>Search</Button>
      </div>
      <TabsContent value="explorer" className="">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap justify-between gap-y-6 mt-4">
          {" "}
          {exploreData.length === 0 && (
            <Bounded>
              <div className="flex justify-center items-center">
                No any Latest Tokens tokens found
              </div>
            </Bounded>
          )}
          {exploreData.length > 0 &&
            exploreData.map((item, index) => {
              return (
                <div key={index}>
                  <TokenCard data={item} key={item.id} />
                </div>
              );
            })}
        </div>
      </TabsContent>
      <TabsContent value="top_performer" className="">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap gap-x-1 justify-between gap-y-6 mt-4">
          {popularData.length === 0 && (
            <Bounded>
              <div className="flex justify-center items-center">
                No any Top Tokens tokens found
              </div>
            </Bounded>
          )}
          {popularData.length > 0 &&
            popularData.map((item) => {
              return <PopularTokenCard data={item} key={item.id} />;
            })}
        </div>
      </TabsContent>
      <TabsContent value="lp_matured" className="">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap gap-x-1 justify-between gap-y-6 mt-4">
          {lpMaturedTokens.length === 0 && (
            <Bounded>
              <div>No any LP Matured tokens found</div>
            </Bounded>
          )}
          {lpMaturedTokens.length > 0 &&
            lpMaturedTokens.map((item) => {
              return <LpMaturedTokenCard data={item} key={item.id} />;
            })}
        </div>
      </TabsContent>
    </Tabs>
  );
}
