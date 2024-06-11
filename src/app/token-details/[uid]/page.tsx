import {
  fetchToken,
  fetchTokenByIDWithCounts,
  fetchTokenById,
  viewTokenById,
} from "@/action/tokens";
import { fetchTokenOHLCData } from "@/action/trades";
import { fetchWishlistByUser } from "@/action/wishlist";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Bounded from "@/components/Bounded";
import TokenDetails from "@/components/TokenDetails";
import axios from "axios";
import { getServerSession } from "next-auth";

type Params = { uid: string };

export default async function Home({ params }: { params: Params }) {
  const token_id = params.uid;
  const server_session = await getServerSession(authOptions);
  const wishlistData = await fetchWishlistByUser(
    server_session?.user?.name,
    token_id
  );

  const token_viewed = await viewTokenById(token_id);

  // const ohlcData = await fetchTokenOHLCData(token_id, 300);
  // console.log(ohlcData);

  if (!token_viewed)
    return (
      <main>
        <Bounded>
          <div>Internal Server Error </div>
        </Bounded>
      </main>
    );

  const token_data = await fetchTokenById(token_id);

  if (!token_data)
    return (
      <main>
        <Bounded>
          <div>Invalid Token ID</div>
        </Bounded>
      </main>
    );

  return (
    <main>
      <Bounded>
        <TokenDetails data={token_data} wishlistData={wishlistData} />
        <div></div>
      </Bounded>
    </main>
  );
}
