const config: Config = {
  infuraId: "f992eab8e1244dc793cf14073f01e7ae",
  tokens: [
    {
      name: "AGIX",
      symbol: "agix",
      address: "0x5B7533812759B45C2B44C19e320ba2cD2681b542",
      excludeBalancesOf: ["0x19184ab45c40c2920b0e0e31413b9434abd243ed", "0x8699b0ffff9136df5fed0175baf4b65477378a3d"],
    },
  ],
};

type Config = {
  infuraId: string;
  tokens: Token[];
};

type Token = {
  name: string;
  symbol: string;
  address: string;
  excludeBalancesOf: string[];
};

export default config;
