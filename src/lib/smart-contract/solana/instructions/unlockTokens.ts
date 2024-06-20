import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { getSyphonTokenLockProgram } from "../common";
import {
  getGlobalATA,
  getLockingAccountPDA,
  getMetadataPDA,
  getMintKeysFromSeeds,
  getProgramSigner,
  getTokenATA,
  getTokenvaultPDA,
} from "../pda";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { MPL_TOKEN_METADATA_PROGRAM_ID, fee_recipient } from "../constants";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getMint,
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";

type ResponseType = {
  txHash: string;
};

export const unlockPlatformTokens = async (
  connection: Connection,
  wallet: WalletContextState,
  mint_account: PublicKey,
  token_amount: number,
  lock_type: string
): Promise<ResponseType> => {
  if (!wallet.publicKey) {
    return { txHash: "" };
  }
  const syphonLockProgram = getSyphonTokenLockProgram(connection, wallet);

  let TxIns: TransactionInstruction[] = [];

  const user_ata = getAssociatedTokenAddressSync(
    mint_account,
    wallet.publicKey
  );

  const globalLockedTokenAccount = getGlobalATA();

  const lock_acc = getLockingAccountPDA(wallet.publicKey.toString(), lock_type);

  const program_signer = getProgramSigner();

  const unlockTokensInstrcution = await syphonLockProgram.methods
    .unlockTokens(lock_type)
    .accounts({
      user: wallet.publicKey,
      globalLockedTokenAccount: globalLockedTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      lockingAccount: lock_acc,
      userTokenAccount: user_ata,
      programSigner: program_signer,
    })
    .instruction();
  TxIns.push(unlockTokensInstrcution);

  const recentBlockhash = await connection.getLatestBlockhash();

  const transactoinMsg = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: recentBlockhash.blockhash,
    instructions: TxIns,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(transactoinMsg);

  const signedTransaction = await wallet.signTransaction!(transaction);

  const transactionResponse = await connection.sendRawTransaction(
    signedTransaction.serialize(),
    { skipPreflight: true }
  );

  console.log(`transaction sent ${transactionResponse}`);
  console.log("confirming transaction...");
  await connection.confirmTransaction({
    blockhash: recentBlockhash.blockhash,
    signature: transactionResponse,
    lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
  });

  console.log(`transaction confirmed: ${transactionResponse}`);
  return { txHash: transactionResponse };
};
