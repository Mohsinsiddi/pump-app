import { Program } from "@project-serum/anchor";
import { PumpGame } from "../type";
import { PublicKey } from "@solana/web3.js";
import { LockedTokenAccountTyp } from "@/types/solanaTypes";

export const fetchLockingAccountData = async (
  tokenLockProgram: Program<PumpGame>,
  locking_acc_pda: PublicKey
) => {
  try {
    const data = await tokenLockProgram.account.lockingAccount.fetch(
      locking_acc_pda
    );
    console.log(data);
    if (data) {
      const return_data: LockedTokenAccountTyp = {
        owner: data.owner.toString(),
        amount: data.amount.toNumber(),
        start_time: data.startTime.toNumber(),
        end_time: data.endTime.toNumber(),
        reward_multiplier: data.rewardMultiplier,
        lock_type: data.lockType,
      };
      return return_data;
    }

    return data;
  } catch (error) {
    return null;
  }
};
