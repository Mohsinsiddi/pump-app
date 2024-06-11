import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TokenCard from "./TokenCard";
import { RenderData } from "@/types/solanaTypes";
import UserTokensCard from "./UserTokensCard";
import {
  CreatedTokens,
  UserRewardsCountType,
  WishlistTokens,
} from "@/types/db.types";
import UserCreatedTokensCard from "./UserCreatedTokensCard";
import { Separator } from "./ui/separator";
import { UserRewards } from "./UserRewards";
import WishlistsTokensCard from "./WishlistsTokensCard";

interface ProfileDetailsTabsProps {
  userData: RenderData[] | null | undefined;
  created_tokens: CreatedTokens;
  wishlisted_data: WishlistTokens | undefined;
  user_rewards_count_data: UserRewardsCountType;
}

export function ProfileTabs({
  userData,
  created_tokens,
  wishlisted_data,
  user_rewards_count_data,
}: ProfileDetailsTabsProps) {
  return (
    <Tabs defaultValue="coins_held">
      <TabsList className="grid w-[360px] md:w-[840px] grid-cols-4 place-items-center mt-1">
        <TabsTrigger value="coins_held" className="w-[100px] md:w-[200px]">
          Coins Held
        </TabsTrigger>
        <TabsTrigger value="coins_created" className="w-[100px] md:w-[200px]">
          Coins Created
        </TabsTrigger>
        <TabsTrigger value="user_wishlist" className="w-[100px] md:w-[200px]">
          Wishlists
        </TabsTrigger>
        <TabsTrigger value="user_rewards" className="w-[100px] md:w-[200px]">
          Rewards
        </TabsTrigger>
      </TabsList>
      <TabsContent value="coins_held" className="">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap gap-x-1 justify-between gap-y-6 mt-4">
          {!userData && <div>Error to display user tokens</div>}
          {userData &&
            userData.map((data, index) => {
              return <UserTokensCard data={data} key={index} />;
            })}
        </div>
      </TabsContent>
      <TabsContent value="coins_created" className=" ">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap gap-x-1 justify-between gap-y-6 mt-4">
          {!created_tokens && <div>Error to display user created tokens</div>}
          {created_tokens &&
            created_tokens.map((token, index) => {
              return <UserCreatedTokensCard data={token} key={index} />;
            })}
        </div>
      </TabsContent>
      <TabsContent value="user_wishlist" className=" ">
        <div>
          <Separator />
        </div>
        <div className="flex flex-wrap gap-x-1 justify-between gap-y-6 mt-4">
          {!wishlisted_data && (
            <div>Error to display user wishlisted token data</div>
          )}
          {wishlisted_data &&
            wishlisted_data.map((token, index) => {
              return <WishlistsTokensCard data={token} key={index} />;
            })}
        </div>
      </TabsContent>
      <TabsContent
        value="user_rewards"
        className="flex flex-wrap gap-x-1 justify-between gap-y-6"
      >
        <div>
          <Separator />
        </div>
        <div>
          {user_rewards_count_data && (
            <UserRewards userData={user_rewards_count_data} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
