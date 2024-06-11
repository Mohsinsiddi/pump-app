import React from "react";
import { ProfileTabs } from "./ProfileTabs";
import { RenderData } from "@/types/solanaTypes";
import {
  CreatedTokens,
  UserRewardsCountType,
  WishlistTokens,
} from "@/types/db.types";

interface ProfileDetailsProps {
  userData: RenderData[] | null | undefined;
  created_tokens: CreatedTokens;
  wishlisted_data: WishlistTokens | undefined;
  user_rewards_count_data: UserRewardsCountType;
}

export default function ProfileDetails({
  userData,
  created_tokens,
  wishlisted_data,
  user_rewards_count_data,
}: ProfileDetailsProps) {
  return (
    <div className="">
      <ProfileTabs
        userData={userData}
        created_tokens={created_tokens}
        wishlisted_data={wishlisted_data}
        user_rewards_count_data={user_rewards_count_data}
      />
    </div>
  );
}
