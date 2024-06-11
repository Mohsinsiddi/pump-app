import {
  fetchAllTokenDataForTokenIds,
  fetchIfTokensLaunchedOnPlatform,
  fetchTokensCreatedByUser,
} from "@/action/tokens";
import { fetchUsersVariousCounts } from "@/action/users";
import { fetchUserWishlists, fetchUserWishlistsData } from "@/action/wishlist";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Bounded from "@/components/Bounded";
import ProfileDetails from "@/components/ProfileDetails";
import { mergeLaunchIds } from "@/util/mergeLaunchIds";
import { fetchUserSPLTokens } from "@/util/solana/getUserSPLTokens";
import { Connection } from "@solana/web3.js";
import axios from "axios";
import { getServerSession } from "next-auth";

type Params = { user_address: string };

export default async function Home({ params }: { params: Params }) {
  const server_session = await getServerSession(authOptions);
  if (!server_session || !server_session.user?.name) {
    return <div>Please sign in first</div>;
  }
  const rpcConnection = new Connection("https://api.devnet.solana.com");
  const userTokens = await fetchUserSPLTokens(
    server_session?.user?.name,
    rpcConnection
  );

  if (!userTokens) {
    return (
      <main>
        <Bounded>
          <div>Error while fetching user tokens</div>
        </Bounded>
      </main>
    );
  }

  const tokenIds = userTokens?.map((token) => token.mint);
  const checked_data = await fetchIfTokensLaunchedOnPlatform(tokenIds);

  if (!checked_data) {
    return (
      <main>
        <Bounded>
          <div>Error while fetching user tokens</div>
        </Bounded>
      </main>
    );
  }

  const checked_user_token_data = mergeLaunchIds(checked_data, userTokens);

  const created_tokens = await fetchTokensCreatedByUser(
    server_session?.user?.name
  );

  const wishListTokenData = await fetchUserWishlistsData(
    server_session?.user?.name
  );

  const user_rewawards_count_data = await fetchUsersVariousCounts(
    server_session?.user?.name
  );

  if (!user_rewawards_count_data) {
    return <div>Error in fetching User Rewads Data</div>;
  }

  const rewards_data = {
    ...user_rewawards_count_data,
    lp_matured_tokens_count: 2,
  };

  return (
    <main>
      <Bounded>
        <ProfileDetails
          userData={checked_user_token_data}
          created_tokens={created_tokens}
          wishlisted_data={wishListTokenData}
          user_rewards_count_data={rewards_data}
        />
      </Bounded>
    </main>
  );
}
