import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
  PublicKeyInitData,
} from "@solana/web3.js";
import axios from "axios";
import { getTokenMetadata } from "./getTokenMetadata";
import { RenderData } from "@/types/solanaTypes";

export const fetchUserSPLTokens = async (
  wallet: string | null | undefined,
  connection: Connection
) => {
  try {
    if (!wallet) {
      return null;
    }

    const isMain = false;
    if (isMain) {
      const data = await axios.get(
        `https://api.helius.xyz/v0/addresses/${wallet}/balances?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
      );
      const tokens = data.data.tokens;
      const splTokens = tokens.filter(
        (item: any) => item.decimals > 0 && item.amount > 0
      );

      const renderTokenData: RenderData[] = [];
      for (var i = 0; i < splTokens.length; i++) {
        const mintAddress = splTokens[i].mint;
        const amount = splTokens[i].amount / 10 ** splTokens[i].decimals;
        const rawtokenMetadata = await getTokenMetadata(
          new PublicKey(mintAddress),
          connection
        );
        if (!rawtokenMetadata) {
          continue;
        }
        renderTokenData.push({
          name: rawtokenMetadata?.tokenName,
          symbol: rawtokenMetadata?.tokenSymbol,
          image: rawtokenMetadata?.tokenLogo,
          amount,
          mint: mintAddress,
          decimal: splTokens[i].decimals,
          description: rawtokenMetadata.tokenDescription,
          isFullyFetched: rawtokenMetadata.isFullFetched,
          isMutable: rawtokenMetadata.isMutable,
        });
      }
      return renderTokenData;
    } else {
      const data = await axios.get(
        `https://api-devnet.helius.xyz/v0/addresses/${wallet}/balances?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`
      );
      const tokens = data.data.tokens;
      const splTokens = tokens.filter(
        (item: any) => item.decimals > 0 && item.amount > 0
      );

      const renderTokenData: RenderData[] = [];
      for (var i = 0; i < splTokens.length; i++) {
        const mintAddress = splTokens[i].mint;
        const decimal = splTokens[i].decimals;
        const amount = splTokens[i].amount / 10 ** splTokens[i].decimals;
        const rawtokenMetadata = await getTokenMetadata(
          new PublicKey(mintAddress),
          connection //devnet connection
        );
        if (!rawtokenMetadata) {
          continue;
        }
        renderTokenData.push({
          name: rawtokenMetadata?.tokenName,
          symbol: rawtokenMetadata?.tokenSymbol,
          image: rawtokenMetadata?.tokenLogo,
          isMutable: rawtokenMetadata?.isMutable,
          isFullyFetched: rawtokenMetadata.isFullFetched,
          amount,
          mint: mintAddress,
          decimal: decimal,
          description: rawtokenMetadata.tokenDescription,
        });
      }
      return renderTokenData;
    }
  } catch (error) {
    console.warn(error);
  }
};
