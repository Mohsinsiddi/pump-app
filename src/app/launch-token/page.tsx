import { AvailablePositionDrawer } from "@/components/AvailablePositionDrawer";
import { fetchPositionBasedHighlights } from "@/action/highlights";
import Bounded from "@/components/Bounded";
import { TokenLaunchForm } from "@/components/LaunchToken";
import { Json } from "@/lib/database.types";

export default async function Home() {
  const data: Json = await fetchPositionBasedHighlights();
  return (
    <main>
      <Bounded>
        <AvailablePositionDrawer data={data} />
        <TokenLaunchForm />
      </Bounded>
    </main>
  );
}
