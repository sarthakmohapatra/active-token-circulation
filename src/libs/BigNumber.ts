import BigNumber from "bignumber.js";

type BigNumberish = BigNumber | string | number;
export const toFraction = (balance: BigNumberish, decimals: BigNumberish): BigNumber => {
  const numerator = new BigNumber(balance);
  const denominator = new BigNumber(10).exponentiatedBy(decimals);
  const value = numerator.dividedBy(denominator);

  return value;
};
