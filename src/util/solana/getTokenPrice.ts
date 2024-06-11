import { SCALE, calculateTokenPrice } from "./priceHelper";

export const getTokenPrice = (supply: number) => {
  return calculateTokenPrice(supply) / SCALE;
};
