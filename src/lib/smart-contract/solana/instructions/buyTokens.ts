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
import { getSyphonProgram } from "../common";
import { getMetadataPDA, getMintKeysFromSeeds, getTokenvaultPDA } from "../pda";
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

export const buyTokenOnSolana = async (
  connection: Connection,
  wallet: WalletContextState,
  mint_account: PublicKey,
  sol_amount: number,
  unique_token_symnol: string,
  creator_address: PublicKey
): Promise<ResponseType> => {
  if (!wallet.publicKey) {
    return { txHash: "" };
  }
  const syphonProgram = getSyphonProgram(connection, wallet);

  let TxIns: TransactionInstruction[] = [];

  const vault_pda = await getTokenvaultPDA(mint_account);
  const amount = new anchor.BN(sol_amount * LAMPORTS_PER_SOL);

  const user_ata = getAssociatedTokenAddressSync(
    mint_account,
    wallet.publicKey
  );

  const buyTokensInstrcution = await syphonProgram.methods
    .buyTokens(unique_token_symnol, amount)
    .accounts({
      mintAccount: mint_account,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      payer: wallet.publicKey,
      pda: vault_pda,
      associatedTokenAccount: user_ata,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      creatorAddress: creator_address,
    })
    .instruction();
  TxIns.push(buyTokensInstrcution);

  const recentBlockhash = await connection.getLatestBlockhash();

  const transactoinMsg = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: recentBlockhash.blockhash,
    instructions: TxIns,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(transactoinMsg);

  const signedTransaction = await wallet.signTransaction!(transaction);

  const transactionResponse = await connection.sendRawTransaction(
    signedTransaction.serialize()
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
