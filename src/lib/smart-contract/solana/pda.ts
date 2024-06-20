import { PublicKey } from "@solana/web3.js";
import {
  MPL_TOKEN_METADATA_PROGRAM_ID,
  syphonProgramID,
  syphonTokenLockProgramID,
} from "./constants";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

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

export const getLockingAccountPDA = (
  user_address: string,
  lock_type: string
) => {
  const [lock_acc] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("lock_account"),
      Buffer.from(lock_type),
      new PublicKey(user_address).toBuffer(),
    ],
    syphonTokenLockProgramID
  );
  return lock_acc;
};

export const getGlobalATA = () => {
  const [globalLockedTokenAccount, globalLockedTokenAccountBump] =
    PublicKey.findProgramAddressSync(
      [Buffer.from("global_locked_token_account")],
      syphonTokenLockProgramID
    );
  return globalLockedTokenAccount;
};

export const getProgramSigner = () => {
  const [program_signer, _] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_signer")],
    syphonTokenLockProgramID
  );
  return program_signer;
};

export const getTokenATA = (OWNER: PublicKey, MINT: PublicKey) => {
  const [ata_address] = PublicKey.findProgramAddressSync(
    [OWNER.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), MINT.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return ata_address;
};
