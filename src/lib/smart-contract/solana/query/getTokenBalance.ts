import { Connection, PublicKey } from "@solana/web3.js";

export const getTokenBalanceWeb3 = async (
  connection: Connection,
  tokenAccount: PublicKey
) => {
  try {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error("No balance found");
    return info.value.uiAmount;
  } catch (error) {
    return 0;
  }
};
