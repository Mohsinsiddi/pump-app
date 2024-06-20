import { AnchorProvider, Program } from "@project-serum/anchor";
import { IDL, SyphonTokenLockIDl } from "./idl";
import { Connection } from "@solana/web3.js";
import { syphonProgramID, syphonTokenLockProgramID } from "./constants";
import { Pump, PumpGame } from "./type";
import idl from "./pump.json";
import syphonTokenLockIDL from "./pump_game.json";

const syphonprogramInterface = JSON.parse(JSON.stringify(idl));
const syphonLockProgramInterface = JSON.parse(
  JSON.stringify(syphonTokenLockIDL)
);

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

export const getSyphonTokenLockProgram = (
  connection: Connection,
  wallet: any
): Program<PumpGame> => {
  const provider = new AnchorProvider(connection, wallet, {
    preflightCommitment: "confirmed",
    maxRetries: 3,
  });
  return new Program(
    SyphonTokenLockIDl,
    syphonTokenLockProgramID,
    provider
  ) as unknown as Program<PumpGame>;
};
