import {
  Connection,
  LAMPORTS_PER_SOL,
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
  mint: string;
};

export const createTokenOnSolana = async (
  connection: Connection,
  wallet: WalletContextState,
  name: string,
  symbol: string,
  metadata_uri: string,
  decimals: number,
  SOLBuyAmount: number,
  isToknHighlighting: boolean,
  position: string,
  hours: string
): Promise<ResponseType> => {
  if (!wallet.publicKey) {
    return { txHash: "", mint: "" };
  }
  const syphonProgram = getSyphonProgram(connection, wallet);

  const metadata = {
    name,
    symbol,
    uri: metadata_uri,
    decimals: decimals,
  };

  let TxIns: TransactionInstruction[] = [];

  const mint_account = await getMintKeysFromSeeds(
    metadata.symbol,
    wallet.publicKey
  );

  const metadata_account = await getMetadataPDA(mint_account);

  const vault_pda = await getTokenvaultPDA(mint_account);

  const createTokenInstrcution = await syphonProgram.methods
    .createToken(metadata)
    .accounts({
      mintAccount: mint_account,
      metadataAccount: metadata_account,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenMetadataProgram: MPL_TOKEN_METADATA_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      payer: wallet.publicKey,
      recipient: fee_recipient,
      pda: vault_pda,
    })
    .instruction();
  TxIns.push(createTokenInstrcution);

  if (SOLBuyAmount > 0) {
    const user_ata = getAssociatedTokenAddressSync(
      mint_account,
      wallet.publicKey
    );
    const amount = new anchor.BN(SOLBuyAmount * LAMPORTS_PER_SOL);

    const buyTokensInstrcution = await syphonProgram.methods
      .buyTokens(metadata.symbol, amount)
      .accounts({
        mintAccount: mint_account,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        payer: wallet.publicKey,
        pda: vault_pda,
        associatedTokenAccount: user_ata,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        creatorAddress: wallet.publicKey,
      })
      .instruction();
    TxIns.push(buyTokensInstrcution);
  }

  if (isToknHighlighting || (position !== "0" && hours !== "0")) {
    const pos = new anchor.BN(position);
    const slot_hours = new anchor.BN(hours);
    // Mint the tokens to the associated token account.
    const tokenHighlighInstruction = await syphonProgram.methods
      .highlightToken(metadata.symbol, pos, slot_hours)
      .accounts({
        payer: wallet.publicKey,
        mintAccount: mint_account,
        systemProgram: SystemProgram.programId,
        creatorAddress: wallet.publicKey,
        recipient: fee_recipient,
      })
      .instruction();
    TxIns.push(tokenHighlighInstruction);
  }

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
  return { txHash: transactionResponse, mint: mint_account.toBase58() };
};
