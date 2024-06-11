import { PublicKey } from "@solana/web3.js";
import { IDL } from "./idl";

export const syphonProgramID: PublicKey = new PublicKey(IDL.metadata.address);

export const MPL_TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const fee_recipient = new PublicKey(
  "devjbkEUcKtEfw3h8nzScA4eS1tyWejcpTzNJmr46Xa"
);

export const GLOBAL_DECIMAL = 6;

export const TOTAL_SUPPLY = 1000000000;
export const TOTAL_LINEAR_BONDING_SALE_SUPPLY = 100000000;
