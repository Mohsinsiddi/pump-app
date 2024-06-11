import { getAccount, getMint } from "@solana/spl-token";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Signer,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export const getUserTokenBalance = async (
  connection: Connection,
  tokenAccount: PublicKey
) => {
  try {
    const info = await connection.getTokenAccountBalance(tokenAccount);
    if (info.value.uiAmount == null) throw new Error("No balance found");
    console.log("Balance (using Solana-Web3.js): ", info.value.uiAmount);
    return info.value.uiAmount;
  } catch (e) {
    return 0;
  }
};
