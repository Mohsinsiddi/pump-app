import { syphonProgramID } from "@/lib/smart-contract/solana/constants";
import { IDL } from "@/lib/smart-contract/solana/idl";
import { BN, BorshCoder } from "@project-serum/anchor";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { SCALE } from "../priceHelper";

export const decodeTxSignature = async (
  connection: Connection,
  txHash: string[]
) => {
  try {
    const programAddress = syphonProgramID.toString();
    // we will use confirm transaction to get the transaction logs
    const txList = await connection.getTransactions(txHash, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });
    if (txList[0]?.meta?.err) {
      return null;
    }

    const returnDatawithtx: any = {};
    txList.forEach((tx, i) => {
      if (!tx) throw new Error("could not find transaction");
      const coder = new BorshCoder(IDL);
      const programIdIndex = tx.transaction.message.staticAccountKeys.findIndex(
        (a) => a.toBase58() == programAddress
      );
      const instructionsNew =
        tx.transaction.message.compiledInstructions.filter(
          (i) => i.programIdIndex == programIdIndex
        );
      let returnData: any = {};
      const instructionsDecodedData = [];
      for (let i = 0; i < instructionsNew.length; i++) {
        const data = Buffer.from(instructionsNew[i].data);
        if (!data) throw new Error("could not find data");
        const ix = coder.instruction.decode(data, "base58");
        if (!ix) throw new Error("could not decode instruction");
        console.log("FUNCTION NAME: ", ix.name);
        console.log("PARAMS");
        const outputData: any = {};
        Object.keys(ix.data as any).map((k) => {
          if ((ix.data as any)[k] instanceof BN) {
            outputData[k] = (ix.data as any)[k].toNumber();
            console.log(k, "=>", (ix.data as any)[k].toNumber());
          } else {
            outputData[k] = (ix.data as any)[k];
            console.log(k, "=>", (ix.data as any)[k]);
          }
        });
        const accounts = instructionsNew[i].accountKeyIndexes.map((idx) => {
          return tx.transaction.message.staticAccountKeys[idx];
        });
        console.log("ACCOUNTS");
        IDL.instructions
          .find((i) => i.name === ix.name)
          ?.accounts?.map((acc, idx) => {
            outputData[acc.name] = accounts[idx].toBase58();
            console.log(acc.name, "=>", accounts[idx].toBase58());
          });
        console.log(tx.meta?.logMessages);
        const required_log_message = tx?.meta?.logMessages![6];
        const splitted_log_message = required_log_message?.split(" ");
        console.log(splitted_log_message);
        const token_price = splitted_log_message![6];
        const price_in_sol = parseInt(token_price);
        console.log(price_in_sol / LAMPORTS_PER_SOL / SCALE);
        returnData = {
          functionName: ix.name,
          params: outputData,
          price: price_in_sol / LAMPORTS_PER_SOL / SCALE,
          price_paid: 0,
          created_at: txList[0]?.blockTime,
        };
        instructionsDecodedData.push(returnData);
      }
      returnDatawithtx[tx.transaction.signatures[0]] = instructionsDecodedData;
    });
    return returnDatawithtx;
  } catch (err) {
    return null;
  }
};
