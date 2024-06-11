import { AnchorProvider, Program } from "@project-serum/anchor";
import { IDL } from "./idl";
import { Connection } from "@solana/web3.js";
import { syphonProgramID } from "./constants";
import { Pump } from "./type";
import idl from "./pump.json";

const syphonprogramInterface = JSON.parse(JSON.stringify(idl));

export const getSyphonProgram = (
  connection: Connection,
  wallet: any
): Program<Pump> => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    maxRetries: 3,
  });
  return new Program(
    IDL,
    syphonProgramID,
    provider
  ) as unknown as Program<Pump>;
};
