import { fetchPositionBasedHighlights } from "@/action/highlights";
import {
  fetchLPMaturedTokens,
  fetchPopularTokens,
  fetchTokens,
} from "@/action/tokens";
import Bounded from "@/components/Bounded";
import { CarouselLaunches } from "@/components/CarouselLaunches";
import LaunchTokenButton from "@/components/LaunchTokenButton";
import { MainTab } from "@/components/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Json } from "@/lib/database.types";

export default async function Home() {
  const tokenData = await fetchTokens();

  const tokenDataWithPopularStats = await fetchPopularTokens();

  const lpMaturedTokens = await fetchLPMaturedTokens();

  const data: Json = await fetchPositionBasedHighlights();

  if (!tokenData) {
    return <Bounded>Unable to fetch Token Data</Bounded>;
  }

  if (!lpMaturedTokens) {
    return <Bounded>Unable to fetch LP Matured Token Data</Bounded>;
  }
  return (
    <main>
      <Bounded>
        <CarouselLaunches data={data} />
        <Separator className="my-2 drop-shadow-2xl" />
        <MainTab
          exploreData={tokenData}
          popularData={tokenDataWithPopularStats}
          lpMaturedTokens={lpMaturedTokens}
        />
      </Bounded>
    </main>
  );
}
