import { PublicKey } from "@solana/web3.js";
import { MPL_TOKEN_METADATA_PROGRAM_ID, syphonProgramID } from "./constants";

// Constants from our program
const MINT_SEED = "mmm";
const METADATA_SEED = "metadata";
const TOKEN_VAULT_SEED = "token_vault";

export const getMintKeysFromSeeds = async (
  symbol: string,
  creator_pubkey: PublicKey
) => {
  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED), Buffer.from(symbol), creator_pubkey.toBuffer()],
    syphonProgramID
  );
  return mint;
};

export const getMetadataPDA = async (mint: PublicKey) => {
  const [metadataAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_SEED),
      MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    MPL_TOKEN_METADATA_PROGRAM_ID
  );
  return metadataAccount;
};

export const getTokenvaultPDA = async (mint: PublicKey) => {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from(TOKEN_VAULT_SEED), mint.toBuffer()],
    syphonProgramID
  );
  return pda;
};
