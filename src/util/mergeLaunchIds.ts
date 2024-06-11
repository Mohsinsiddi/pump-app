import { RenderData } from "@/types/solanaTypes";

type TokenIDs = {
  id: string;
};

export const mergeLaunchIds = (
  tokenIds: TokenIDs[] | undefined,
  userTokensData: RenderData[]
) => {
  if (!tokenIds) {
    return null;
  }
  const tokenIdsSet = new Set(tokenIds.map((token) => token.id));

  // Merge and update isPlatformLaunched property
  const updatedRenderData = userTokensData.map((data) => {
    if (tokenIdsSet.has(data.mint)) {
      return { ...data, isPlatformLaunched: true };
    }
    return data;
  });
  return updatedRenderData;
};
