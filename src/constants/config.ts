const config: Config = {
  infuraId: process.env.INFURA_ID,
  tokens: [
    {
      name: "AGIX",
      symbol: "agix",
      address: "0x5B7533812759B45C2B44C19e320ba2cD2681b542",
      excludeBalancesOf: ["0x2ff22f87fdc01ecc235126b98ddc00f70dd2ae0b"],
    },
  ],
  defaultTokenSymbol: "agix",
};

type Config = {
  infuraId: string;
  tokens: Token[];
  defaultTokenSymbol: string;
};

type Token = {
  name: string;
  symbol: string;
  address: string;
  excludeBalancesOf: string[];
};

export default config;
