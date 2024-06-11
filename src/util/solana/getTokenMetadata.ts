import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";

export const getTokenMetadata = async (
  mintAddress: PublicKey,
  connection: Connection
) => {
  const metaplex = Metaplex.make(connection);

  let tokenName;
  let tokenSymbol;
  let tokenLogo;
  let tokenDescription;
  let isMutable;
  let isFullFetched = true;

  const metadataAccount = metaplex
    .nfts()
    .pdas()
    .metadata({ mint: mintAddress });

  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);

  if (metadataAccountInfo) {
    const token = await metaplex
      .nfts()
      .findByMint({ mintAddress: mintAddress });
    tokenName = token?.name;
    tokenSymbol = token?.symbol;
    tokenLogo = token.json?.image;
    tokenDescription = token.json?.description;
    isMutable = token.isMutable;
  } else {
    try {
      const provider = await new TokenListProvider().resolve();
      const tokenList = provider.filterByChainId(ENV.MainnetBeta).getList();
      const tokenMap = tokenList.reduce((map, item) => {
        map.set(item.address, item);
        return map;
      }, new Map());

      const token = tokenMap.get(mintAddress.toBase58());

      tokenName = token.name || "";
      tokenSymbol = token.symbol || "";
      tokenLogo = token.logoURI || "";
    } catch (error) {
      isFullFetched = false;
    }
  }
  return {
    tokenName,
    tokenLogo,
    tokenSymbol,
    tokenDescription,
    isMutable,
    isFullFetched,
  };
};
