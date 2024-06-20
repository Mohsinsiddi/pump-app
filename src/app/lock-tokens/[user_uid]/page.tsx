import Bounded from "@/components/Bounded";
import Locking from "@/components/Locking";
import { fetchLockingAccountData } from "@/lib/smart-contract/solana/accounts/fetchLockingAccount";
import { getSyphonTokenLockProgram } from "@/lib/smart-contract/solana/common";
import { PLATFORM_TOKEN } from "@/lib/smart-contract/solana/constants";
import {
  getLockingAccountPDA,
  getTokenATA,
} from "@/lib/smart-contract/solana/pda";
import { getTokenBalanceWeb3 } from "@/lib/smart-contract/solana/query/getTokenBalance";
import { LockedTokenAccountTyp } from "@/types/solanaTypes";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";

interface LockingOption {
  type: number;
  days: number;
  multiplier: number;
  account_data: LockedTokenAccountTyp | null;
}

type Params = { user_uid: string };

export default async function Home({ params }: { params: Params }) {
  const user_address = params.user_uid;

  if (!user_address) {
    return (
      <div>
        <Bounded>Invalid User Address</Bounded>
      </div>
    );
  }
  const connection = new Connection(clusterApiUrl("devnet"));

  const user_ata = getTokenATA(new PublicKey(user_address), PLATFORM_TOKEN);
  const tokenBalance = await getTokenBalanceWeb3(connection, user_ata);
  const tokenLockProgram = getSyphonTokenLockProgram(
    connection,
    Keypair.generate()
  );

  const locking_account_1 = getLockingAccountPDA(user_address, "1");
  const locking_account_2 = getLockingAccountPDA(user_address, "2");
  const locking_account_3 = getLockingAccountPDA(user_address, "3");
  const data1 = await fetchLockingAccountData(
    tokenLockProgram,
    locking_account_1
  );
  console.log(data1);
  const data2 = await fetchLockingAccountData(
    tokenLockProgram,
    locking_account_2
  );
  console.log(data2);
  const data3 = await fetchLockingAccountData(
    tokenLockProgram,
    locking_account_3
  );
  console.log(data3);
  const lockingoptions: LockingOption[] = [
    { type: 1, days: 45, multiplier: 1.0, account_data: data1 },
    { type: 2, days: 90, multiplier: 1.5, account_data: data2 },
    { type: 3, days: 180, multiplier: 2.0, account_data: data3 },
  ];
  return (
    <div className="">
      <main className="p-4">
        <Bounded>
          <Locking
            tokenBalance={tokenBalance}
            lockingOptions={lockingoptions}
          />
        </Bounded>
      </main>
    </div>
  );
}
